<template>
  <v-app dark class="overflow-hidden max-h-screen">
    <menu-bar />
    <inbox-dialog />
    <msg-dialog />
    <wrong-network-dialog />
    <wrong-wallet-dialog />

    <chat-container
      title="decode.chat"
      :ref-id="refId"
      :user-name="recipient"
      :show-drawer="true"
      :users-online="100"
      :typing-user-count="12"
    />

    <v-dialog v-model="connectWalletDialog" persistent max-width="450">
      <v-card>
        <v-card-title class="text-h5">
          Please connect wallet to chat
        </v-card-title>
        <v-card-text
          >You need a Metamask wallet to proceed to chat with this wallet
          address.</v-card-text
        >
        <v-card-actions class="mb-3">
          <v-spacer />
          <v-btn to="/" text small> back to homepage </v-btn>
          <v-btn
            v-if="walletAddress === null"
            small
            style="
              text-transform: none;
              background: transparent;
              border: 1px solid white;
              border-radius: 12px;
              padding: 12px 16px;
            "
            :disabled="isConnectWalletLoading"
            @click="connectMetamask"
          >
            <v-progress-circular
              v-if="isConnectWalletLoading"
              indeterminate
              size="12"
              width="2"
              color="white"
            ></v-progress-circular>
            <div v-else class="flex">
              <v-img
                src="/logo/metamask.svg"
                alt="Metamask logo"
                max-width="16px"
                max-height="16px"
                class="mr-2 flex-shrink-0"
              />
              <span class="font-bold"> Connect </span>
            </div>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import retrieveWalletsRefId from '~/utils/retrieveWalletsRefId';

export default {
  name: 'ChatWalletPage',
  layout: 'plain',
  data() {
    return {
      recipient: '',
      connectWalletDialog: false,
      isConnectWalletLoading: false,
    };
  },
  head() {
    return {
      title: `decode.chat — ${this.refId}`,
    };
  },
  watch: {
    walletAddress(newVal) {
      if (newVal === null) {
        this.connectWalletDialog = true;
      } else {
        this.connectWalletDialog = false;
      }
    },
  },
  mounted() {
    if (this.walletAddress === null) {
      this.connectWalletDialog = true;
    }

    this.getRecipient();
  },
  computed: {
    ...mapState('account', ['walletAddress']),
    refId() {
      return this.$route.params.id;
    },
  },
  methods: {
    ...mapActions('account', ['connectWallet']),
    async connectMetamask() {
      this.isConnectWalletLoading = true;
      const result = await this.connectWallet();
      this.isConnectWalletLoading = false;

      // error handling
      if (result.success === false) {
        this.$toast.error(result.errTitle + ' ' + result.errMsg, {
          duration: 15000,
        });
      }
    },
    getRecipient() {
      const { addr1, addr2 } = retrieveWalletsRefId(this.refId);

      if (this.walletAddress !== addr1) {
        this.recipient = addr1;
      } else if (this.walletAddress !== addr2) {
        this.recipient = addr2;
      }
    },
  },
};
</script>
