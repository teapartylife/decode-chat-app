import Web3 from 'web3';

let provider = null;
if (window.ethereum) {
  provider = new Web3(window.ethereum);
}
const p = provider;
export default p;
