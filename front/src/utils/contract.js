import contract from 'truffle-contract';

export function instantiateContract(json, provider) {
  const pcContract = contract(json);
  pcContract.setProvider(provider);
  return pcContract.deployed();
}


