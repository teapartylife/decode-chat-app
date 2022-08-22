import web3 from 'web3';

export default (name) => {
  // check if wallet
  if (web3.utils.isAddress(name)) {
    const totalLength = name.length;
    return '0x...' + name.slice(totalLength - 6, totalLength);
  }
  return name;
};
