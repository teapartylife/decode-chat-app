import web3 from 'web3';

export default (wallet1, wallet2) => {
  wallet1 = web3.utils.toChecksumAddress(wallet1);
  wallet2 = web3.utils.toChecksumAddress(wallet2);

  return [wallet1, wallet2].sort().join('-').replace(',', '');
};
