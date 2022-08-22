<template>
  <v-dialog
    :value="showMsgDialog"
    scrollable
    max-width="500"
    @input="(event) => mutateState([{ showMsgDialog: event.value }, 'ui'])"
  >
    <v-card>
      <v-card-title class="text-h5"> Send message to wallet</v-card-title>

      <v-card-text class="mt-3">
        <v-text-field
          v-model="wallet"
          autofocus
          max="200"
          placeholder="Recipient wallet address"
          filled
          rounded
          dense
          :disabled="isInputLocked"
          required
          :hide-details="true"
          @keyup="validateWallet"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <div v-if="sameAddressWarning" class="text-sm mr-3 mb-3">
          Please insert a different address which not belongs to you
        </div>

        <div v-else-if="!validated" class="text-sm mr-3 mb-3">
          <div v-if="!isChecking && !isCreatingChatRoom">
            <span v-if="wallet === ''"> Insert your recipient address </span>

            <div v-else-if="wallet !== ''">
              <v-icon class="mr-1" small>mdi-close-circle</v-icon>
              <span> Invalid address </span>
            </div>
          </div>

          <div v-if="isChecking">Checking chatroom ...</div>

          <div v-if="isCreatingChatRoom">
            Preparing chatroom, please wait ...
          </div>
        </div>

        <v-btn v-else-if="validated" text @click="startChat">
          <v-icon v-if="validated" class="mr-1" color="green" small
            >mdi-checkbox-marked-circle</v-icon
          >
          <span v-if="wallet === '' || validated"> Start messaging </span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import web3 from 'web3';
import randomString from 'random-string';
import getWalletsRefId from '~/utils/getWalletsRefId';
import getChannelInfo from '~/services/decode.social/getChannelInfo';
import createChannel from '~/services/decode.social/createChannel';
import litEncrypt from '~/services/lit/litEncrypt';

export default {
  name: 'MsgDialog',
  computed: {
    ...mapState('ui', ['showMsgDialog', 'msgDialogCheckAddress']),
    ...mapState('account', ['walletAddress']),
  },
  watch: {
    showMsgDialog(newVal) {
      if (!newVal && this.msgDialogCheckAddress) {
        // clear values
        this.mutateState([{ msgDialogCheckAddress: null }, 'ui']);
        this.wallet = '';
      }
    },
    msgDialogCheckAddress(newVal) {
      if (newVal) {
        this.wallet = newVal;
        this.validateWallet();
      }
    },
  },
  data() {
    return {
      wallet: '',
      isChecking: false,
      isCreatingChatRoom: false,
      validated: false,
      sameAddressWarning: false,

      // lock
      isInputLocked: false,
    };
  },
  methods: {
    ...mapMutations(['mutateState']),
    async validateWallet() {
      const val = this.wallet;
      if (val && web3.utils.isAddress(val)) {
        if (val === this.walletAddress) {
          this.sameAddressWarning = true;
        } else {
          this.isInputLocked = true;
          this.isChecking = true;

          const refId = getWalletsRefId(this.walletAddress, val);
          const available = await getChannelInfo({ refId });

          // if not exist create a new room
          if (available === null) {
            this.isChecking = false;
            this.isCreatingChatRoom = true;

            // variables
            const type = 'directchat';
            const chatPassword = randomString({
              length: 32,
              numeric: true,
              letters: true,
              special: true,
            });

            const { base64EncryptedMsg, base64SymmetricKey } = await litEncrypt(
              {
                chatPassword,
                type,
                refId,
              }
            );

            // save new channel to DB
            await createChannel({
              name: '',
              addr1: this.walletAddress,
              addr2: val,
              type,
              encryptedPass: base64EncryptedMsg,
              symmetricKey: base64SymmetricKey,
            });
          }

          // close dialog
          this.mutateState([{ showMsgDialog: false }, 'ui']);

          // go to chatroom
          this.$router.push(`/chat/${refId}`);
        }
      } else {
        this.sameAddressWarning = false;
        this.validated = false;
        this.isChecking = false;
        this.isCreatingChatRoom = false;
      }
    },
    startChat() {
      this.mutateState([{ showMsgDialog: false }, 'ui']);
      this.$router.push(`/chat/${this.wallet}`);
    },
  },
};
</script>

<style></style>
