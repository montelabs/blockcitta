/* Copyright (C) 2017 ethbets
 * All rights reserved.
 * 
 * This software may be modified and distributed under the terms
 * of the BSD license. See the LICENSE file for details.
*/

const Web3 = require('web3');
const fs = require('fs');

const PuntoCittaABI = JSON.parse(fs.readFileSync('./compiledContracts/PuntoCitta.abi'));
const PuntoCittaBin = `0x${fs.readFileSync('./compiledContracts/PuntoCitta.bin').toString()}`

var PuntoCittaJSON = require('../build/contracts/PuntoCitta.json');

const deployAddress = '0x82De95A2c2805731a404C4F652514929cdB463bb';

var web3 = new Web3('http://localhost:8545');

function writeBinABI(buildPath, jsonFile, networkId, address, abi, bin, timestamp) {
  const obj = {
    address: address,
    updated_at: timestamp
  }
  jsonFile.networks[networkId] = obj;
  jsonFile['unlinked_binary'] = bin;
  jsonFile['abi'] = abi;
  fs.writeFileSync(buildPath, JSON.stringify(jsonFile, undefined, 2));
}

function deployContract(contractABI, contractBin, address) {
  return new Promise((resolve, reject) => {
    var monarchyContract = new web3.eth.Contract(contractABI);
    monarchyContract.deploy({
      data: contractBin
    }).send({
      from: address,
      gas: 3940000 
    })
    .on('error', (err) => {console.log('error', err)})
    .on('confirmation', (block, tx) => {
      resolve(tx.contractAddress)
    })
    .catch(() => {});
  });
}

async function deployAll() {
  try{
    const networkId = await web3.eth.net.getId();
    const now = Date.now();
    console.log('Deploying in networkId:', networkId);

    console.log('Deploying PuntoCitta...');
    const puntoCittaAddress = await deployContract(PuntoCittaABI, PuntoCittaBin, deployAddress);
    writeBinABI('./build/contracts/PuntoCitta.json', PuntoCittaJSON, 
                networkId, puntoCittaAddress, PuntoCittaABI, PuntoCittaBin, now);
    console.log('Deployed');

    process.exit();
  }
  catch(err) {
    console.error(err);
  }
}

deployAll();
