<template>
  <v-dialog :value="showWrongWallet" max-width="450" persistent>
    <v-card>
      <v-card-title>
        Hmm... it seems the connected wallet isn't matched</v-card-title
      >

      <v-card-text class="mt-3 text-center" style="max-height: 300px">
        Please make sure you switch to the right wallet before proceed. (You
        could change it on your Metamask)
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text @click="clickLogout"> Logout </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  name: 'WrongWalletDialog',
  computed: {
    ...mapState('ui', ['showWrongWallet']),
  },
  methods: {
    ...mapMutations(['mutateState']),
    ...mapActions('account', ['logout']),
    clickLogout() {
      this.logout();
      this.mutateState([{ showWrongWallet: false }, 'ui']);
    },
  },
};
</script>

<style></style>
