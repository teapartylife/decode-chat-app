export const openAccess = [
  {
    contractAddress: '',
    standardContractType: '',
    chain: 'polygon',
    method: 'eth_getBalance',
    parameters: [':userAddress', 'latest'],
    returnValueTest: {
      comparator: '>=',
      value: '0', // 0 ETH, so anyone can open
    },
  },
];

export const directChatAccessControl = ({ addr1, addr2 }) => {
  return [
    {
      conditionType: '',
      contractAddress: '',
      standardContractType: '',
      chain: 'polygon',
      method: '',
      parameters: [':userAddress'],
      returnValueTest: {
        comparator: '=',
        value: addr1,
      },
    },
    {
      operator: 'or',
    },
    {
      conditionType: '',
      contractAddress: '',
      standardContractType: '',
      chain: 'polygon',
      method: '',
      parameters: [':userAddress'],
      returnValueTest: {
        comparator: '=',
        value: addr2,
      },
    },
  ];
};
