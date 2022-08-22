import axios from 'axios';
import { getBackendApi } from '~/constants/config/app';
const { NODE_ENV } = process.env;

export default async ({ refId, cancelToken }) => {
  try {
    let queryParams = '?';
    if (refId.length) queryParams += `refId=${refId}`;

    // configurations
    const config = {
      withCredentials: true,
    };
    if (cancelToken) config.cancelToken = cancelToken;

    const { data } = await axios.get(
      `${getBackendApi(NODE_ENV)}/channels/info${queryParams}`,
      config
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
