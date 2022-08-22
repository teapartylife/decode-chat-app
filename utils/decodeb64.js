export default (b64String) => {
  return new Uint8Array(Buffer.from(b64String, 'base64'));
};
