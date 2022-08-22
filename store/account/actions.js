import { SiweMessage } from 'siwe';
import { CHAIN_ID, getBackendApi } from '~/constants/config/app';
import provider from '~/services/ethersProvider';
import web3Provider from '~/services/web3Provider';
import chains from '~/constants/chains';
const { NODE_ENV } = process.env;
const domain = window.location.host;
const origin = window.location.origin;

export default {
  async retrieveAccountInfo({ commit, dispatch }) {
    await Promise.all([dispatch('retrieveWallet')]);

    // watch wallet
    dispatch('watchWallet');
  },
  async watchWallet({ dispatch }) {
    if (window.ethereum) {
      await dispatch('checkWalletNetwork');
      await dispatch('checkWalletAddress');

      window.ethereum.on('chainChanged', async () => {
        await dispatch('checkWalletNetwork');
      });

      window.ethereum.on('accountsChanged', async (accounts) => {
        await dispatch('checkWalletAddress');
      });
    }
  },
  async retrieveWallet({ commit, rootState }) {
    try {
      if (rootState.account.walletAddress) {
        const { data } = await this.app.$axios.get(
          `${getBackendApi(NODE_ENV)}/wallet`,
          {
            withCredentials: true,
          }
        );
        commit(
          'mutateState',
          [{ walletAddress: data.walletAddress }, 'account'],
          {
            root: true,
          }
        );
        return true;
      } else return false;
    } catch (err) {
      console.log('No Web3 account log in at the moment');
      return false;
    }
  },
  async connectWallet({ commit }) {
    try {
      await provider
        .send('eth_requestAccounts', [])
        .catch(() => console.log('user rejected request'));

      const chainId = await web3Provider.eth.net.getId();
      const signer = provider.getSigner();
      // const walletAddress = await signer.getAddress();

      // get nonce
      const { data: nonce } = await this.app.$axios.get(
        `${getBackendApi(NODE_ENV)}/wallet/nonce`,
        {
          withCredentials: true,
        }
      );

      // sign message
      const message = new SiweMessage({
        domain,
        address: await signer.getAddress(),
        statement: 'Sign in to decode.chat with Metamask.',
        uri: origin,
        version: '1',
        chainId,
        nonce,
      }).prepareMessage();
      const signature = await signer.signMessage(message);

      const { data } = await this.app.$axios.post(
        `${getBackendApi(NODE_ENV)}/wallet/connect`,
        {
          message,
          signature,
        },
        {
          withCredentials: true,
        }
      );

      commit(
        'mutateState',
        [{ walletAddress: data.walletAddress }, 'account'],
        {
          root: true,
        }
      );
      return { success: true };
    } catch (err) {
      console.error(err);
      if (
        err.response &&
        err.response.data.errors &&
        err.response.data.errors.msg
      ) {
        return {
          success: false,
          errTitle: 'Unable to connect wallet',
          errMsg: err.response.data.errors.msg,
        };
      } else if (err.code === 4001) {
        return {
          success: false,
          errTitle: 'Unable to connect wallet',
          errMsg: 'User denied connect to Metamask wallet.',
        };
      } else {
        return { success: true };
      }
    }
  },
  async checkWalletAddress({ commit, rootState }) {
    const accounts = await provider
      .send('eth_requestAccounts', [])
      .catch(() => console.log('user rejected request'));
    const connectedWallet = rootState.account.walletAddress;
    const currentWalletAddr = web3Provider.utils.toChecksumAddress(accounts[0]);
    let showWrongWallet = connectedWallet !== currentWalletAddr;

    // force remove model if user is not connected
    if (!connectedWallet) showWrongWallet = false;

    commit(
      'mutateState',
      [
        {
          showWrongWallet,
        },
        'ui',
      ],
      { root: true }
    );
  },
  async checkWalletNetwork({ commit, rootState }) {
    const chainId = await web3Provider.eth.net.getId();
    let showWrongNetwork = CHAIN_ID !== chainId;

    // force remove model if user is not connected
    if (!rootState.account.walletAddress) showWrongNetwork = false;

    commit(
      'mutateState',
      [
        {
          showWrongNetwork,
        },
        'ui',
      ],
      { root: true }
    );
  },
  async switchNetwork({ dispatch }) {
    try {
      await web3Provider.currentProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3Provider.utils.toHex(CHAIN_ID) }],
      });
      await dispatch('checkWalletNetwork');
      location.reload();
    } catch (error) {
      if (error.code === 4902) {
        try {
          await web3Provider.currentProvider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: web3Provider.utils.toHex(CHAIN_ID),
                chainName: chains[CHAIN_ID].name,
                rpcUrls: [chains[CHAIN_ID].rpc.mainnet],
                nativeCurrency: {
                  name: chains[CHAIN_ID].baseCurrency.symbol,
                  symbol: chains[CHAIN_ID].baseCurrency.symbol,
                  decimals: chains[CHAIN_ID].baseCurrency.decimals,
                },
                blockExplorerUrls: [chains[CHAIN_ID].blockExplorer.baseUrl],
              },
            ],
          });
          await dispatch('checkWalletNetwork');
        } catch (error) {
          console.error(error.message);
        }
      }
    }
  },
  async logout({ commit }) {
    try {
      commit('RESET_USER');
      await this.app.$axios.get(`${getBackendApi(NODE_ENV)}/user/logout`, {
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
    }
  },
};
