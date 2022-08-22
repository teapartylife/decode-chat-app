import createPersistedState from 'vuex-persistedstate';

export default ({ store }) => {
  createPersistedState({
    key: 'decode.chat_v1.0.0',
    paths: [
      // account
      'account.walletAddress',
    ],
  })(store);
};
