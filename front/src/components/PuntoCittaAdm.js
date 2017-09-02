import React, { Component } from 'react'

import PropTypes from 'prop-types'
import contract from 'truffle-contract';

import PuntoCittaJson from 'build/contracts/PuntoCitta.json';
import {instantiateContract} from 'utils/contract';

import Request from 'components/Request';

class PuntoCittaAdm extends Component {
  constructor(props){
    super(props)
    this.state = {
      requests: [],
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
        if (response.event === 'RequestResolved' || response.event === 'RequestRejected') {
          this.setState(previousState => {
            previousState.requests.splice(response.args.propIdx.toNumber(), 1);
          });
        }
        else if (response.event === 'NewRequest') {
          _contractInstance.requests(response.args.propIdx.toNumber()).then(_p => {
            this.setState(previousState => {
              previousState.requests.push({from: _p[0], resId: _p[1], reqType: _p[2], reqStatus: _p[3], dataHash: _p[4], index: _p[5]});
            })
          });
        }
      });
    }
    catch(err) {
      console.error('Contract not deployed!');
      return;
    }
    var _owner = await _contractInstance.owner();
    var _requests = [];
    var _done = false;
    var i = 0;
    while (!_done) {
      var _p;
      try {
        _p = await _contractInstance.requests(i);
        _requests.push({from: _p[0], resId: _p[1], reqType: _p[2], reqStatus: _p[3], dataHash: _p[4], index: _p[5]});
        ++i;
      }
      catch(e) {
        _done = true;
      }
    }
    this.setState({
      owner: _owner,
      contractInstance: _contractInstance,
      requests: _requests
    });
  }

  render() {
    if (this.context.web3.web3.eth.defaultAccount !== undefined &&
        this.state.owner !== null &&
        this.context.web3.web3.eth.defaultAccount !== this.state.owner)
      return null;

    var propItems = this.state.requests.map(prop =>
      <Request isDetailed={false}
                key={prop.index}
                request={prop}
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
