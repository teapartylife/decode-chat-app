import axios from 'axios';
import { getBackendApi } from '~/constants/config/app';
const { NODE_ENV } = process.env;

export default async ({
  refId,
  before = '',
  after = '',
  limit = 15,
  sort = 1,
  cancelToken,
}) => {
  try {
    let queryParams = '?';
    if (refId.length) queryParams += `refId=${refId}`;
    if (before.length) queryParams += `&before=${before}`;
    if (after.length) queryParams += `&after=${after}`;
    if (limit) queryParams += `&limit=${limit}`;
    queryParams += `&sort=${sort}`; // 1 is oldest, -1 is latest

    // configurations
    const config = {
      withCredentials: true,
    };
    if (cancelToken) config.cancelToken = cancelToken;

    const { data } = await axios.get(
      `${getBackendApi(NODE_ENV)}/messages${queryParams}`,
      config
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
