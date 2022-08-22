<template>
  <v-dialog :value="showWrongNetwork" max-width="450" persistent>
    <v-card>
      <v-card-title> Uh-oh, you're on the wrong network chain</v-card-title>

      <v-card-text class="mt-3 text-center" style="max-height: 300px">
        Please make sure you're on Polygon chain. <br />We need that to decrypt
        any messages. 😊
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text @click="switchNetwork"> Switch to Polygon </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'WrongNetworkDialog',
  computed: {
    ...mapState('ui', ['showWrongNetwork']),
  },
  methods: {
    ...mapActions('account', ['switchNetwork']),
  },
};
</script>

<style></style>
