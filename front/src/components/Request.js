import React, { Component } from 'react'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import {keccak256} from 'js-sha3';
import lodash from 'lodash';
import PropTypes from 'prop-types'
import contract from 'truffle-contract';

import PuntoCittaJson from 'build/contracts/PuntoCitta.json';
import {instantiateContract} from 'utils/contract';

class Request extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      contractInstance: null
    }
  }

  componentWillMount() {
    instantiateContract(PuntoCittaJson, this.context.web3.web3.currentProvider)
    .then((contract) => {
      this.setState({contractInstance: contract});
    })
    .catch(err => {
      console.log('Error: ' + err);
    });
  }

  ReqType = () => {
    var _types = ['Certificato Domicilio', 'Contratto Locazione'];
    return _types[this.props.request.reqType];
  }

  ReqStatus = () => {
    var _status = ['Aperto', 'Risoluto', 'Respinto'];
    return _status[this.props.request.reqStatus];
  }

  ReqTitle = () => {
    var _t = this.ReqType() + ' (' + this.ReqStatus() + ')';
    return _t;
  }

  ResId = () => {
    var _i = 'ID Residente: ' + this.props.request.resId.toString();
    return _i;
  }

  ActionButtons = () => {
    if (!this.state.isExpanded)
      return null;

    return (
      <div
        style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}
      >
        <RaisedButton
          style={{margin: 20}}
          label="Falso"
          secondary={true}
          onTouchTap={() => this.rejectRequest()}
        />
        <RaisedButton
          style={{margin: 20}}
          label="Tutto OK"
          primary={true}
          onTouchTap={() => this.resolveRequest()}
        />
      </div>
    );
  }

  rejectRequest = () => {
    console.log('Reject');
    this.state.contractInstance.rejectRequest(
      this.props.request.index,
      { from: this.context.web3.web3.eth.defaultAccount }
    )
    .then(() => {
      console.log('Request rejected');
    })
    .catch(err => {
      console.log('Error in rejecting request');
    });

  }

  resolveRequest = () => {
    console.log('Resolve');
    if (this.state.contractInstance === null)
      return;

    var _split = this.props.request.dataHash.split('/');
    var _data = _split[0] + '/' + _split[1] + '/' + _split[2] + '/' + _split[3];
    
    var hash = keccak256(_data);
    this.state.contractInstance.resolveRequest(
      this.props.request.index, hash,
      { from: this.context.web3.web3.eth.defaultAccount }
    )
    .then(() => {
      console.log('Request resolved');
    })
    .catch(err => {
      console.log('Error in resolving request');
    });
  }

  render() {
    if (this.props.request.reqStatus.toString() !== '0')
      return null;

    return (
      <Card style={{marginRight: 80, marginBottom: 20}}
            onExpandChange={lodash.debounce(this.onExpand, 150)}
            expanded={this.state.isExpanded}
      >
        <CardHeader
          actAsExpander={true}
          showExpandableButton={true}
          title={this.ReqTitle()}
          subtitle={this.ResId()}
        />
        <CardText expandable={true}>
          Dati: {this.props.request.dataHash}
        </CardText>
        <this.ActionButtons />
      </Card>
    );
  }

  onExpand = () => {
    this.setState(previousState => ({isExpanded: !previousState.isExpanded}));
  }

}

Request.contextTypes = {
  web3: PropTypes.object
};

export default Request;
