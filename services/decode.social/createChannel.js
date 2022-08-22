import axios from 'axios';
import { getBackendApi } from '~/constants/config/app';
const { NODE_ENV } = process.env;

export default async ({
  name,
  addr1 = '',
  addr2 = '',
  type,
  encryptedPass,
  symmetricKey,
}) => {
  try {
    const { data } = await axios.post(
      `${getBackendApi(NODE_ENV)}/channels/create`,
      {
        name,
        addr1,
        addr2,
        type,
        encryptedPass,
        symmetricKey,
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
