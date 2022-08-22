import LitJsSdk from 'lit-js-sdk';
import encodeb64 from '~/utils/encodeb64';
import blobToBase64 from '~/utils/blobToBase64';
import {
  openAccess,
  directChatAccessControl,
} from '~/services/lit/accessControl';
import retrieveWalletsRefId from '~/utils/retrieveWalletsRefId';

export default async ({ chatPassword, type, refId }) => {
  // 0. Connect to Lit node
  const litNodeClient = new LitJsSdk.LitNodeClient();
  await litNodeClient.connect();
  const chain = 'polygon';

  // 1. Encryption
  // <Blob> encryptedString
  // <Uint8Array(32)> symmetricKey
  const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
    chatPassword
  );
  const base64EncryptedMsg = await blobToBase64(encryptedString);

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

  // 2. Saving the Encrypted Content to the Lit Nodes
  // <Unit8Array> encryptedSymmetricKey
  const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
    accessControlConditions,
    symmetricKey,
    authSig,
    chain,
  });
  const base64SymmetricKey = encodeb64(encryptedSymmetricKey);

  return {
    base64EncryptedMsg,
    base64SymmetricKey,
  };
};
