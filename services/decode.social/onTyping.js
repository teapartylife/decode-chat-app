import axios from 'axios';
import { getBackendApi } from '~/constants/config/app';
const { NODE_ENV } = process.env;

export default async ({ refId }) => {
  try {
    const { data } = await axios.post(
      `${getBackendApi(NODE_ENV)}/messages/typing`,
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
