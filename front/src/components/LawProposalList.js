import React, { Component } from 'react'
import _ from 'lodash';

import PropTypes from 'prop-types'
import contract from 'truffle-contract';

import PuntoCittaJson from 'build/contracts/PuntoCitta.json';
import {instantiateContract} from 'utils/contract';

import LawProposal from 'components/LawProposal';

class LawProposalList extends Component {
  constructor(props){
    super(props)
    this.state = {
      lawProposals: [],
      contractInstance: null,
      owner: null
    }
  }

  componentWillMount() {
    this.instantiate();
  }

  async instantiate() {
    var _contractInstance;
    try {
      _contractInstance = await instantiateContract(PuntoCittaJson, this.context.web3.web3.currentProvider);
      let laterEvents = _contractInstance.allEvents({
        fromBlock: 'latest',
        toBlock: 'latest'
      });
      laterEvents.watch((error, response) => {
        if (response.event === 'NewLawProposal') {
          _contractInstance.lawProposals(response.args.propIdx.toNumber()).then(_p => {
            this.setState(previousState => {
              previousState.lawProposals.push({from: _p[0], title: _p[1], desc: _p[2], signs: _p[3], index: _p[4]});
            })
          });
        }
        else if (response.event === 'NewSignature') {
          var _idx = response.args.lawPropIdx;
          var _from = response.args.from;
          var _lawProposals = _.clone(this.state.lawProposals);
          _lawProposals[_idx].signs = _lawProposals[_idx].signs.plus('1');
          this.setState({lawProposals: _lawProposals});
        }
      });
    }
    catch(err) {
      console.error('Contract not deployed!');
      return;
    }
    var _owner = await _contractInstance.owner();
    var _lawProposals = [];
    var _done = false;
    var i = 0;
    while (!_done) {
      var _p;
      try {
        _p = await _contractInstance.lawProposals(i);
        _lawProposals.push({from: _p[0], title: _p[1], desc: _p[2], signs: _p[3], index: _p[4]});
        ++i;
      }
      catch(e) {
        _done = true;
      }
    }
    this.setState({
      owner: _owner,
      contractInstance: _contractInstance,
      lawProposals: _lawProposals
    });
  }

  render() {
    /*
    if (this.context.web3.web3.eth.defaultAccount !== undefined &&
        this.state.owner !== null &&
        this.context.web3.web3.eth.defaultAccount !== this.state.owner)
      return null;
    */

    var propItems = this.state.lawProposals.map(prop =>
      <LawProposal isDetailed={false}
                key={prop.index}
                lawProposal={prop}
      />
    );

    return (
      <ul style={{flexFlow: 'column', justifyContent: 'space-between'}}>
        {propItems}
      </ul>
    );
  }

}

LawProposalList.contextTypes = {
  web3: PropTypes.object
};

export default LawProposalList;
