export default (uintarray) => {
  const b64 = Buffer.from(uintarray).toString('base64');
  return b64;
};
