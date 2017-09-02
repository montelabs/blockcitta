import React, { Component } from 'react'

import contract from 'truffle-contract';

import PuntoCittaJson from 'build/contracts/PuntoCitta.json';

class PuntoCittaAdm extends Component {
  constructor(props){
    super(props)
    this.state = {
      proposals: [],
      contractInstance: null
    }
  }

  componentWillMount() {
    this.instantiateContract();
  }


  async instantiateContract() {
    const pcContract = contract(PuntoCittaJson);
    pcContract.setProvider(this.context.web3.web3.currentProvider);
    var _contractInstance;
    try {
      _contractInstance = await pcContract.deployed();
    }
    catch(err) {
      console.error('Contract not deployed!');
      return;
    }
    console.log(_contractInstance);
    this.setState({
      contractInstance: _contractInstance
    });
  }

  render() {
    return (
      <div>lala</div>
    );
  }

}

