import Vue from 'vue';
import formatWallet from '~/utils/formatWallet';
import coloring from '~/utils/coloring';

Vue.prototype.$utils = {
  formatWallet,
  coloring,
};
