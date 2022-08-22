import axios from 'axios';
import { getBackendApi } from '~/constants/config/app';
const { NODE_ENV } = process.env;

export default async ({ refId }) => {
  try {
    const { data } = await axios.post(
      `${getBackendApi(NODE_ENV)}/channels/active`,
      {
        refId,
      },
      {
        withCredentials: true,
      }
    );
    return data;
  } catch (err) {
    console.error(err);
  }
};
