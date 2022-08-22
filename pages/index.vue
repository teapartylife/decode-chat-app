<template>
  <v-container class="h-full py-0">
    <!-- Header -->
    <div class="text-center mt-3" data-aos="fade-up">
      <h1 class="font-mono text-4xl md:text-6xl mb-2 max-w-5xl mx-auto">
        Simple. Encrypted. Decentralized.
      </h1>
      <h2 class="font-mono text-sm md:text-md text-gray-400">
        Still in experiment. Don't send any sensitive info yet.
      </h2>
    </div>

    <!-- Chat container -->
    <section
      data-aos="fade-up"
      data-aos-delay="300"
      class="chat-container border border-white mx-auto mt-8 rounded-xl relative overflow-hidden flex flex-col mb-5 md:mb-1"
    >
      <chat-container
        :show-logo="false"
        :ref-id="globalChatRefId"
        title="Global chat"
        :demo="true"
        :items="chatItems"
        :show-drawer="false"
        :users-online="100"
        :typing-user-count="12"
      />
    </section>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'IndexPage',
  data() {
    return {
      title: 'decode.chat',
      isConnectWalletLoading: false,
      globalChatRefId: 'global-chat-c9de2aa6-dfed-4ac1-b5aa-a274fcbc7db1',
      chatPassword: null,
      chatItems: [],
    };
  },
  computed: {
    ...mapState('account', ['walletAddress']),
  },
  methods: {
    ...mapMutations(['mutateState']),
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
  },
};
</script>

<style lang="scss" scoped>
.chat-container {
  width: 850px;
  height: 500px;
}
</style>
