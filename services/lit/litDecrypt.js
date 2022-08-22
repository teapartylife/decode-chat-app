import LitJsSdk from 'lit-js-sdk';
import b64toBlob from '~/utils/b64toBlob';
import decodeb64 from '~/utils/decodeb64';
import {
  openAccess,
  directChatAccessControl,
} from '~/services/lit/accessControl';
import retrieveWalletsRefId from '~/utils/retrieveWalletsRefId';

export default async ({ encryptedPass, symmetricKey, type, refId = '' }) => {
  // 0. Connect to Lit node
  const litNodeClient = new LitJsSdk.LitNodeClient();
  await litNodeClient.connect();

  // 3. Decrypt it
  // <String> toDecrypt
  const chain = 'polygon';
  const toDecrypt = LitJsSdk.uint8arrayToString(
    decodeb64(symmetricKey),
    'base16'
  );

  // get authSig
  const authSig = await LitJsSdk.checkAndSignAuthMessage({
    chain,
  });

  // get access control
  let accessControlConditions = '';
  if (type === 'public') {
    accessControlConditions = openAccess;
  } else if (type === 'directchat') {
    const { addr1, addr2 } = retrieveWalletsRefId(refId);
    accessControlConditions = directChatAccessControl({
      addr1,
      addr2,
    });
  }

  // get decoded symmetricKey
  const _symmetricKey = await litNodeClient.getEncryptionKey({
    accessControlConditions,
    toDecrypt,
    chain,
    authSig,
  });

  // <String> decryptedString
  let decryptedString;
  try {
    decryptedString = await LitJsSdk.decryptString(
      b64toBlob(encryptedPass),
      _symmetricKey
    );
  } catch (e) {
    console.log(e);
  }

  return decryptedString;
};
