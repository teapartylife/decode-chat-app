import axios from 'axios';
import { getBackendApi } from '~/constants/config/app';
const { NODE_ENV } = process.env;

export default async () => {
  try {
    // configurations
    const config = {
      withCredentials: true,
    };

    const { data } = await axios.get(
      `${getBackendApi(NODE_ENV)}/channels`,
      config
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
