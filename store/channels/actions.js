import { getBackendApi } from '~/constants/config/app';
const { NODE_ENV } = process.env;

export default {
  async createChannel() {
    try {
      await this.app.$axios.post(
        `${getBackendApi(NODE_ENV)}/channels/create`,
        {
          name: 'Global chat',
          type: 'public',
          encryptedPass: 'test',
          symmetricKey: 'test',
        },
        {
          withCredentials: true,
        }
      );
      return { success: true };
    } catch (err) {
      console.error(err);
    }
  },
};
