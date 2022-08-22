<template>
  <v-app dark class="overflow-hidden">
    <menu-bar />
    <inbox-dialog />
    <msg-dialog />
    <wrong-network-dialog />
    <wrong-wallet-dialog />

    <v-app-bar color="black">
      <nuxt-link class="inline-flex align-center" to="/">
        <v-img src="/logo/decode.svg" alt="Decode logo" max-width="18px" />
        <v-toolbar-title
          class="subtitle-1 font-weight-bold grey--text text--lighten-2 ml-2"
          v-text="title"
        />
      </nuxt-link>

      <v-spacer />

      <nuxt-link
        to="/about"
        class="font-mono font-bold mr-12 hidden md:inline-flex"
        style="color: white; font-size: 0.875rem"
      >
        About project
      </nuxt-link>

      <div class="hidden md:block">
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

      <v-btn class="block md:hidden" icon @click="showMenu = !showMenu">
        <v-icon v-if="showMenu">mdi-close</v-icon>
        <v-icon v-else>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="bg-black">
      <div
        v-if="showMenu"
        class="block md:hidden border border-gray-500 rounded-xl py-5 mx-3"
      >
        <nuxt-link
          to="/about"
          class="font-mono font-bold flex md:hidden justify-center"
          style="color: white; font-size: 0.875rem"
        >
          About project
        </nuxt-link>

        <v-btn
          v-if="walletAddress"
          text
          class="font-mono font-bold flex md:hidden justify-center w-full mt-5"
          style="color: white; font-size: 0.875rem; text-transform: none"
          @click="mutateState([{ showDrawer: true }, 'ui'])"
        >
          Show action panel
        </v-btn>

        <div class="flex items-center justify-center mt-5">
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
      </div>

      <Nuxt />
    </v-main>

    <!-- <footer-bar /> -->
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default {
  name: 'AboutPage',
  data() {
    return {
      title: 'decode.chat',
      showMenu: false,
      isConnectWalletLoading: false,
    };
  },
  async fetch() {
    await this.retrieveAccountInfo();
  },
  mounted() {
    AOS.init({});
  },
  computed: {
    ...mapState('account', ['walletAddress']),
  },
  methods: {
    ...mapMutations(['mutateState']),
    ...mapActions('account', ['connectWallet', 'retrieveAccountInfo']),
    async connectMetamask() {
      try {
        this.isConnectWalletLoading = true;
        const result = await this.connectWallet();
        this.isConnectWalletLoading = false;

        // error handling
        if (result.success === false) {
          this.$toast.error(result.errTitle + ' ' + result.errMsg, {
            duration: 15000,
          });
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
