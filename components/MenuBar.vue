<template>
  <v-navigation-drawer
    :value="showDrawer"
    :mini-variant="miniVariant"
    :clipped="clipped"
    :right="true"
    absolute
    temporary
    color="black"
    @input="(event) => mutateState([{ showDrawer: event.value }, 'ui'])"
  >
    <v-list>
      <v-list-item
        v-for="(item, i) in navs"
        :key="i"
        :to="item.to"
        class="hover:bg-gray-800 cursor-pointer"
        router
        exact
        @click="onClick(item.title)"
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'MenuBar',
  computed: {
    ...mapState('ui', ['showDrawer']),
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      miniVariant: false,
      right: true,
      navs: [
        {
          icon: 'mdi-earth',
          title: 'Global chat',
          to: '/',
        },
        {
          icon: 'mdi-inbox',
          title: 'Chatroom',
          to: '',
        },
        {
          icon: 'mdi-message-plus',
          title: 'Message someone',
          to: '',
        },
        {
          icon: 'mdi-logout-variant',
          title: 'Logout',
          to: '',
        },
      ],
    };
  },
  methods: {
    ...mapMutations(['mutateState']),
    ...mapActions('account', ['logout']),
    onClick(title) {
      if (title === 'Chatroom') {
        this.mutateState([{ showInboxDialog: true, showDrawer: false }, 'ui']);
      } else if (title === 'Message someone') {
        this.mutateState([{ showMsgDialog: true, showDrawer: false }, 'ui']);
      } else if (title === 'Logout') {
        this.mutateState([{ showDrawer: false }, 'ui']);
        this.logout();
      }
    },
  },
};
</script>

<style></style>
