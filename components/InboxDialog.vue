<template>
  <v-dialog
    :value="showInboxDialog"
    scrollable
    max-width="700"
    @input="(event) => mutateState([{ showInboxDialog: event.value }, 'ui'])"
  >
    <v-card>
      <v-card-title v-if="vItems" class="text-h5">
        Chatroom{{ vItems.length > 1 ? 's' : '' }} ({{
          vItems.length
        }})</v-card-title
      >

      <v-card-text v-if="vItems" class="mt-3 pb-0" style="max-height: 300px">
        <v-list-item
          v-for="(item, idx) in vItems"
          :key="idx"
          class="flex flex-col text-left flex-wrap cursor-pointer mx-6 bg-gray-800 rounded-lg mb-5 hover:bg-gray-700"
          style="padding: 12px; min-height: auto; align-items: flex-start"
          @click="goTo(item.refId)"
        >
          <div class="flex justify-start content-start">
            <v-avatar tile size="24" class="rounded-lg">
              <blocky-avatar :size="48" :scale="3" :address="item.name" />
            </v-avatar>
            <v-list-item-title
              class="align-self-start font-bold my-1 ml-2"
              :style="`color: ${$utils.coloring(
                item.name
              )}; font-size: 0.875rem`"
            >
              {{ item.name }}
            </v-list-item-title>
            <span
              v-if="item.unread"
              class="flex items-center ml-3 text-xs opacity-70 font-mono"
            >
              (unread)
            </span>
          </div>
          <v-list-item-subtitle
            style="white-space: normal; font-size: 0.75rem"
            class="mt-3 opacity-50"
          >
            Last message at:
            <span class="font-bold">
              {{ $dayjs(item.lastUpdated).format('h:mm A · MMM D, YYYY') }}
            </span>
          </v-list-item-subtitle>
        </v-list-item>
      </v-card-text>

      <v-card-text v-else class="mt-12 flex items-center justify-center">
        <v-progress-circular
          indeterminate
          size="56"
          width="2"
          color="white"
        ></v-progress-circular>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="white darken-1"
          text
          @click="mutateState([{ showInboxDialog: false }, 'ui'])"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import getChannels from '~/services/decode.social/getChannels';
import checkOwnWalletRefId from '~/utils/checkOwnWalletRefId';

export default {
  name: 'InboxDialog',
  computed: {
    ...mapState('ui', ['showInboxDialog']),
    ...mapState('account', ['walletAddress']),
  },
  watch: {
    showInboxDialog(newVal) {
      if (newVal) {
        this.checkChannels();
      } else this.vItems = null;
    },
  },
  methods: {
    ...mapMutations(['mutateState']),
    readMore(content) {
      if (content.length > 150) {
        return content.slice(0, 150) + ' ... read more.';
      }
    },
    async checkChannels() {
      const channels = await getChannels();
      this.vItems = channels.map((item) => {
        const { refId, lastUpdated } = item;
        const { recipient, myselfOrder } = checkOwnWalletRefId({
          refId,
          myself: this.walletAddress,
        });
        let unread = false;
        if (myselfOrder === 'addr1') {
          unread = item.isOwner1Read === false;
        } else if (myselfOrder === 'addr2') {
          unread = item.isOwner2Read === false;
        }

        return {
          name: recipient,
          content: '',
          refId,
          unread,
          lastUpdated,
        };
      });
    },
    goTo(refId) {
      this.mutateState([{ showInboxDialog: false }, 'ui']);
      this.$router.push(`/chat/${refId}`);
    },
  },
  data() {
    return {
      dialog: false,
      vItems: null,
    };
  },
};
</script>

<style></style>
