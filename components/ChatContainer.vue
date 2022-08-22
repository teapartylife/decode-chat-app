<template>
  <div ref="containerEl" class="relative overflow-hidden flex flex-col">
    <v-app-bar color="black" dense :clipped-left="false" class="flex-grow-0">
      <nuxt-link class="inline-flex align-center" to="/">
        <v-img
          v-if="showLogo"
          src="/logo/decode.svg"
          alt="Decode logo"
          max-width="18px"
        />
        <v-toolbar-title
          class="subtitle-1 font-weight-bold grey--text text--lighten-2 ml-2"
          v-text="title"
        />
      </nuxt-link>
      <div
        v-if="!userName"
        class="ml-3 text-white font-mono text-xs opacity-40"
      >
        {{ usersOnline }} user{{ usersOnline > 1 ? 's' : '' }} online
      </div>
      <div v-if="!userName" class="hidden md:inline-block">
        <pulse-ball
          :color="pulseColor ? pulseColor : usersOnline > 0 ? 'green' : 'gray'"
        />
      </div>

      <v-spacer />

      <div v-if="showDrawer">
        <v-btn
          v-if="walletAddress === null"
          small
          style="
            text-transform: none;
            background: transparent;
            border: 1px solid white;
            border-radius: 12px;
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

        <v-btn
          v-else
          small
          style="
            text-transform: none;
            background: transparent;
            border: 1px solid white;
            border-radius: 12px;
          "
          @click="mutateState([{ showDrawer: true }, 'ui'])"
        >
          <div class="flex justify-center">
            <v-avatar tile size="16" class="rounded-lg">
              <blocky-avatar :size="48" :scale="3" :address="walletAddress" />
            </v-avatar>
            <span class="ml-2" :style="`color: ${walletAddress}`">
              {{ $utils.formatWallet(walletAddress) }}
            </span>
          </div>
        </v-btn>
      </div>
    </v-app-bar>

    <div
      v-if="userName"
      class="mx-auto inline-flex items-center justify-center text-white font-mono text-xs w-full px-4 pb-1"
      style="border-bottom: 1px solid rgba(255, 255, 255, 0.1)"
    >
      <v-avatar tile size="12" class="rounded-lg mt-1">
        <blocky-avatar :size="48" :scale="3" :address="userName" />
      </v-avatar>
      <span
        class="ml-2 mt-1"
        :style="`color: ${$utils.coloring(userName)}; font-size: 0.625rem`"
      >
        {{
          $screen.breakpoint === 'xs' ? $utils.formatWallet(userName) : userName
        }}
      </span>
      <span
        v-if="type === 'directchat'"
        class="ml-2 mt-1"
        :style="`font-size: 0.625rem`"
      >
        ({{ usersOnline > 0 ? 'online' : 'offline' }})
      </span>

      <div class="inline-block mt-1">
        <pulse-ball
          :color="pulseColor ? pulseColor : usersOnline > 0 ? 'green' : 'gray'"
        />
      </div>
    </div>

    <menu-bar />
    <div
      class="flex-grow relative"
      :style="
        !demo
          ? `max-height: calc(100% - 48px - 16px - 4px - 35.5px)`
          : `max-height: calc(100% - 48px - 16px - 4px)`
      "
    >
      <div class="flex flex-col justify-between h-full">
        <!-- Chat section -->
        <div ref="chatSection" class="overflow-auto px-4">
          <v-progress-circular
            v-if="isLoadMoreLoading"
            indeterminate
            size="48"
            width="2"
            class="d-block mx-auto text-center my-5"
            color="white"
          ></v-progress-circular>
          <div v-waypoint="{ active: true, callback: loadMore }" />

          <article
            v-for="(item, i) in vItems"
            :key="i"
            :class="[
              'flex items-center w-full p-2 rounded-lg hover:bg-gray-800 transition-colors mb-1',
              {
                'flex-row-reverse':
                  walletAddress === item.owner[0].walletAddress,
              },
            ]"
          >
            <div
              :class="
                walletAddress !== item.owner[0].walletAddress
                  ? 'cursor-pointer'
                  : ''
              "
              @click="chatWithAddress(item.owner[0].walletAddress)"
            >
              <v-avatar tile size="36" class="rounded-lg">
                <!-- <v-img
                src="https://cdn.vuetifyjs.com/images/lists/1.jpg"
                alt=""
                ></v-img> -->
                <blocky-avatar
                  :size="48"
                  :scale="3"
                  :address="item.owner[0].walletAddress"
                />
              </v-avatar>
            </div>

            <div
              style="max-width: 500px"
              :class="[
                'inline-flex flex-col flex-wrap',
                {
                  'ml-3': walletAddress !== item.owner[0].walletAddress,
                  'mr-3': walletAddress === item.owner[0].walletAddress,
                },
              ]"
            >
              <div class="inline-flex items-center">
                <div
                  :class="
                    walletAddress !== item.owner[0].walletAddress
                      ? 'cursor-pointer'
                      : ''
                  "
                  @click="chatWithAddress(item.owner[0].walletAddress)"
                >
                  <div
                    :style="`color: ${$utils.coloring(
                      item.owner[0].walletAddress
                    )}; font-size: 0.625rem`"
                    class="font-bold font-mono mr-3"
                  >
                    {{ $utils.formatWallet(item.owner[0].walletAddress) }}
                  </div>
                </div>

                <div
                  class="text-gray-500 font-mono"
                  style="font-size: 0.625rem"
                >
                  {{ $dayjs(item.createdAt).format('h:mm A · MMM D, YYYY') }}
                </div>
              </div>

              <span
                class="text-sm text-gray-100 break-words"
                style="word-break: break-word"
              >
                {{
                  walletAddress && chatPassword
                    ? aesDecrypt(item.content)
                    : item.content
                }}
              </span>
            </div>
          </article>

          <!-- Cache post message for UI purpose -->
          <article
            v-if="uiCachePostContent"
            class="flex items-center w-full p-2 rounded-lg hover:bg-gray-800 transition-colors mb-1 flex-row-reverse"
          >
            <div>
              <v-avatar tile size="36" class="rounded-lg">
                <blocky-avatar :size="48" :scale="3" :address="walletAddress" />
              </v-avatar>
            </div>

            <div
              style="max-width: 500px"
              :class="['inline-flex flex-col flex-wrap mr-3']"
            >
              <div class="inline-flex items-center">
                <div>
                  <div
                    :style="`color: ${$utils.coloring(
                      walletAddress
                    )}; font-size: 0.625rem`"
                    class="font-bold font-mono mr-3"
                  >
                    {{ $utils.formatWallet(walletAddress) }}
                  </div>
                </div>

                <div
                  class="text-gray-500 font-mono"
                  style="font-size: 0.625rem"
                >
                  {{
                    $dayjs(uiCachePostContent.createdAt).format(
                      'h:mm A · MMM D, YYYY'
                    )
                  }}
                </div>
              </div>

              <span
                class="text-sm text-gray-100 break-words"
                style="word-break: break-word"
              >
                {{ uiCachePostContent.content }}
              </span>
            </div>
          </article>
        </div>

        <div class="inline-flex flex-grow mx-4">
          <div class="inline-flex flex-grow relative items-end">
            <v-text-field
              v-model="userInput"
              :placeholder="
                walletAddress
                  ? 'Type your message'
                  : 'Connect wallet to decode message'
              "
              filled
              :disabled="walletAddress === null || cooldown > 0"
              rounded
              dense
              required
              :hide-details="true"
              max-length="500"
              @keydown.native="onTyping"
              @keydown.enter="onSubmit"
            ></v-text-field>
            <v-btn
              class="ml-2"
              :disabled="
                walletAddress === null || !chatPassword || cooldown > 0
              "
              @click="onSubmit"
            >
              <span v-if="cooldown <= 0"> Send </span>
              <span v-else>
                {{ cooldown }}
              </span>
            </v-btn>

            <!-- Typing user count -->
            <div
              v-if="typingUserCount > 0 && type === 'public'"
              class="absolute font-mono text-gray-600 italic"
              style="bottom: -1rem; left: 1.5rem; font-size: 0.625rem"
            >
              {{ typingUserCount }} user{{ typingUserCount > 1 ? 's' : '' }}
              currently typing
              <span class="typing-dot">.</span>
            </div>

            <div
              v-if="typingUserCount > 0 && type === 'directchat'"
              class="absolute font-mono text-gray-600 italic"
              style="bottom: -1rem; left: 1.5rem; font-size: 0.625rem"
            >
              {{ $utils.formatWallet(recipient) }} is currently typing
              <span class="typing-dot">.</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog for decrypt loader -->
    <div
      v-if="showDecryptDialog"
      class="w-full h-full absolute flex items-center justify-center"
      style="background: rgba(0, 0, 0, 0.3)"
    >
      <div
        class="text-white font-bold text-lg p-5 rounded-lg"
        style="background: rgba(0, 0, 0, 0.8)"
      >
        Decrypting messages 🔓 ...
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import CryptoJS from 'crypto-js';
import debounce from 'lodash.debounce';
// import randomString from 'random-string';
import MenuBar from './MenuBar.vue';
import getChannelInfo from '~/services/decode.social/getChannelInfo';
import getMsg from '~/services/decode.social/getMsg';
import getChannelStats from '~/services/decode.social/getChannelStats';
import markChannelAsRead from '~/services/decode.social/markChannelAsRead';
import onTyping from '~/services/decode.social/onTyping';
import pingActive from '~/services/decode.social/pingActive';
import postMsg from '~/services/decode.social/postMsg';
import litDecrypt from '~/services/lit/litDecrypt';
import checkOwnWalletRefId from '~/utils/checkOwnWalletRefId';

export default {
  name: 'ChatContainer',
  computed: {
    ...mapState('account', ['walletAddress']),
  },
  components: { MenuBar },
  watch: {
    walletAddress(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.scrollToLatest(true);
        this.startLitDecrypt();
      }
    },
  },
  props: {
    refId: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    showLogo: {
      type: Boolean,
      default: true,
    },
    showDrawer: {
      type: Boolean,
      default: true,
    },
    userName: {
      type: String,
      default: '',
    },
    pulseColor: {
      type: String,
      default: '', // green or gray
    },
    demo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      chatPassword: null,
      type: '',
      encryptedPass: '',
      symmetricKey: '',
      recipient: '',

      // ui
      userInput: '',
      vItems: [],
      typingUserCount: 0,
      usersOnline: 0,
      showDecryptDialog: false,
      isConnectWalletLoading: false,
      placeholder: 'Connect wallet to decode message',
      loadMoreEnded: false,
      isLoadMoreLoading: false,
      proceedShowMsg: false,
      uiCachePostContent: null,
      cooldown: 0,

      // lock
      lockCheckNewMsg: false,
    };
  },
  async fetch() {
    try {
      // assign messages & typing count & active users
      const [msgs, channelInfo] = await Promise.all([
        getMsg({
          refId: this.refId,
          sort: -1,
        }),
        getChannelInfo({
          refId: this.refId,
        }),
      ]);

      // check if channel is valid else route to main page
      if (channelInfo === null) {
        this.$router.push('/');
      }

      // get channel info
      const { encryptedPass, symmetricKey, type } = channelInfo;

      // assign messages
      if (type === 'public') this.proceedShowMsg = true;
      else if (type === 'directchat' && this.walletAddress) {
        const checkResult = checkOwnWalletRefId({
          refId: this.refId,
          myself: this.walletAddress,
        });
        if (checkResult) {
          this.proceedShowMsg = true;
          this.recipient = checkResult.recipient;

          // mark channel as read
          markChannelAsRead({ refId: this.refId });
        }
      }

      // show messages if okay
      if (this.proceedShowMsg) {
        if (msgs && msgs.length) this.vItems = msgs.reverse();
      }

      // get chatPassword
      this.type = type;
      this.encryptedPass = encryptedPass;
      this.symmetricKey = symmetricKey;

      // check stats
      this.initCheckStats();

      // scroll to bottom
      this.$nextTick(() => {
        this.scrollToLatest(true);
      });

      await this.startLitDecrypt();

      /**
       * Check new msg every 1s interval
       */
      await this.initIntervalCheckMsgs();

      /**
       * 1. get total number of active users in this channel
       * 2. get total users currently typing
       */
      this.initIntervalCheckStats();
    } catch (err) {
      console.error(err);
    }
  },
  methods: {
    ...mapMutations(['mutateState']),
    ...mapActions('account', ['connectWallet']),
    scrollToLatest(force = false) {
      const ref = this.$refs.chatSection;

      if (ref) {
        const diff = ref.scrollHeight - ref.clientHeight - ref.scrollTop < 100;

        // only scroll to bottom if user very close to bottom
        if (diff || force) ref.scrollTop = ref.scrollHeight;
      }
    },
    scrollBeforeLoadMore() {
      const ref = this.$refs.chatSection;

      if (ref) {
        // leave little gap for load more
        ref.scrollTop = 100;
      }
    },
    async onSubmit() {
      if (this.userInput && this.cooldown <= 0) {
        const cache = this.userInput;
        try {
          const content = this.aesEncrypt(this.userInput);
          this.uiCachePostContent = {
            content: this.userInput,
            createdAt: new Date(),
          };

          // clear content
          this.userInput = '';

          // start cooldown
          this.startCooldown();

          // push to server
          await postMsg({
            refId: this.refId,
            content,
            type: this.type,
          });
          this.scrollToLatest(true);
        } catch (err) {
          console.error(err);
          this.userInput = cache;
        }
      }
    },
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
    aesEncrypt(content) {
      return CryptoJS.AES.encrypt(content, this.chatPassword).toString();
    },
    aesDecrypt(ciphertext) {
      const bytes = CryptoJS.AES.decrypt(ciphertext, this.chatPassword);
      return bytes.toString(CryptoJS.enc.Utf8);
    },
    async startLitDecrypt() {
      try {
        if (this.walletAddress) {
          this.showDecryptDialog = true;
          this.chatPassword = await litDecrypt({
            encryptedPass: this.encryptedPass,
            symmetricKey: this.symmetricKey,
            type: this.type,
            refId: this.refId,
          });
          this.showDecryptDialog = false;
        }
      } catch (err) {
        this.$router.push('/');
      }
    },
    initIntervalCheckMsgs() {
      if (!this.msgCheckInterval) {
        this.msgCheckInterval = setInterval(async () => {
          await this.checkNewMsg();

          // scroll to bottom if necessary
          this.scrollToLatest();
        }, 1000); // every 1 seconds
      }
    },
    async checkNewMsg() {
      if (this.proceedShowMsg && !this.lockCheckNewMsg) {
        this.lockCheckNewMsg = true;
        let after = '';

        // search against latest item
        if (this.vItems.length) {
          const last = this.vItems[this.vItems.length - 1];
          after = last.createdAt;
        }

        const msgs = await getMsg({
          refId: this.refId,
          after,
          sort: 1,
        });
        if (msgs && msgs.length) {
          this.vItems = [...this.vItems, ...msgs];
          this.uiCachePostContent = null;
        }

        // unlock
        this.lockCheckNewMsg = false;
      }
    },
    onTyping: debounce(async function () {
      await Promise.all([
        onTyping({
          refId: this.refId,
        }),
      ]);
    }, 500),
    initIntervalCheckStats() {
      if (!this.statsCheckInterval) {
        this.statsCheckInterval = setInterval(async () => {
          await this.initCheckStats();
        }, 3000); // every 3 seconds
      }
    },
    async initCheckStats() {
      if (this.proceedShowMsg) {
        try {
          const { activeUsersCount, typingCount } = await getChannelStats({
            refId: this.refId,
            type: this.type,
          });
          this.usersOnline = activeUsersCount;
          this.typingUserCount = typingCount;

          this.pingAsActiveUser();
        } catch (err) {
          console.error(err);
        }
      }
    },
    async pingAsActiveUser() {
      if (this.walletAddress) {
        try {
          await pingActive({ refId: this.refId });
        } catch (err) {
          console.error(err);
        }
      }
    },
    async loadMore(waypointState) {
      const { going, direction } = waypointState;
      if (
        !this.loadMoreEnded &&
        this.vItems.length &&
        going === 'in' &&
        direction === 'bottom'
      ) {
        const first = this.vItems[0];
        this.isLoadMoreLoading = true;

        // assign messages & typing count & active users
        const msgs = await getMsg({
          refId: this.refId,
          before: first.createdAt,
          sort: -1,
        });
        if (msgs && msgs.length)
          this.vItems = [...msgs.reverse(), ...this.vItems];
        else {
          this.loadMoreEnded = true;
        }

        // end load more loader
        this.isLoadMoreLoading = false;

        // scroll to give space for load more
        this.scrollBeforeLoadMore();
      }
    },
    chatWithAddress(recipient) {
      if (this.walletAddress && this.walletAddress !== recipient) {
        this.mutateState([
          { showMsgDialog: true, msgDialogCheckAddress: recipient },
          'ui',
        ]);
      }
    },
    startCooldown() {
      this.cooldown = 5; // 5 seconds
      if (this.cooldownInterval) clearInterval(this.cooldownInterval);

      this.cooldownInterval = setInterval(() => {
        this.cooldown -= 1;
        if (this.cooldown <= 0) clearInterval(this.cooldownInterval);
      }, 1000);
    },
  },
  beforeDestroy() {
    if (this.statsCheckInterval) clearInterval(this.statsCheckInterval);
    if (this.msgCheckInterval) clearInterval(this.msgCheckInterval);
  },
};
</script>

<style lang="scss" scoped>
.typing-dot {
  position: absolute;
  bottom: -2px;
  font-size: 1rem;
  margin-left: 2px;
  animation: typing-animate 0.5s infinite;
}

@keyframes typing-animate {
  0% {
    transform: translate(0, 0);
  }

  50% {
    transform: translate(24px, 0);
  }

  100% {
    transform: translate(0, 0);
  }
}
</style>
