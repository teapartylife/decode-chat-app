import axios from 'axios';
import { getBackendApi } from '~/constants/config/app';
const { NODE_ENV } = process.env;

export default async ({ refId, type, cancelToken }) => {
  try {
    let queryParams = '?';
    if (refId.length) queryParams += `refId=${refId}`;
    if (type.length) queryParams += `&type=${type}`;

    // configurations
    const config = {
      withCredentials: true,
    };
    if (cancelToken) config.cancelToken = cancelToken;

    const { data } = await axios.get(
      `${getBackendApi(NODE_ENV)}/channels/stats${queryParams}`,
      config
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
