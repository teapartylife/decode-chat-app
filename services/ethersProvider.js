import { ethers } from 'ethers';

let provider = null;
if (window.ethereum) {
  provider = new ethers.providers.Web3Provider(window.ethereum);
}
const p = provider;
export default p;
