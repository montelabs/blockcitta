import React, { Component } from 'react'

import PropTypes from 'prop-types'
import contract from 'truffle-contract';

import PuntoCittaJson from 'build/contracts/PuntoCitta.json';

import Proposal from 'components/Proposal';

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
    var _proposals = [];
    var _done = false;
    var i = 0;
    while (!_done) {
      var _p;
      try {
        _p = await _contractInstance.proposals(i);
        _proposals[i] = {from: _p[0], resId: _p[1], reqType: _p[2], reqStatus: _p[3], dataHash: _p[4], index: _p[5]};
        ++i;
      }
      catch(e) {
        _done = true;
      }
    }
    console.log(_proposals);
    this.setState({
      contractInstance: _contractInstance,
      proposals: _proposals
    });
  }

  render() {
    var propItems = this.state.proposals.map(prop =>
      <Proposal isDetailed={false}
                key={prop.index}
                proposal={prop}
      />
    );

    return (
      <ul style={{flexFlow: 'column', justifyContent: 'space-between'}}>
        {propItems}
      </ul>
    );
  }

}

PuntoCittaAdm.contextTypes = {
  web3: PropTypes.object
};

export default PuntoCittaAdm;
