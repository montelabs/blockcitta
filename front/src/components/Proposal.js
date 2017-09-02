import React, { Component } from 'react'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import {keccak256} from 'js-sha3';
import lodash from 'lodash';
import PropTypes from 'prop-types'
import contract from 'truffle-contract';

import PuntoCittaJson from 'build/contracts/PuntoCitta.json';
import {instantiateContract} from 'utils/contract';

class Proposal extends Component {
  constructor(props) {
    super(props);
    console.log(props);
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
    return _types[this.props.proposal.reqType];
  }

  ReqStatus = () => {
    var _status = ['Aperto', 'Risoluto', 'Respinto'];
    return _status[this.props.proposal.reqStatus];
  }

  ReqTitle = () => {
    var _t = this.ReqType() + ' (' + this.ReqStatus() + ')';
    return _t;
  }

  ResId = () => {
    var _i = 'ID Residente: ' + this.props.proposal.resId.toString();
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
          onTouchTap={() => this.rejectProposal()}
        />
        <RaisedButton
          style={{margin: 20}}
          label="Tutto OK"
          primary={true}
          onTouchTap={() => this.resolveProposal()}
        />
      </div>
    );
  }

  rejectProposal = () => {
    console.log('Reject');
    this.state.contractInstance.rejectProposal(
      this.props.proposal.index,
      { from: this.context.web3.web3.eth.defaultAccount }
    )
    .then(() => {
      console.log('Proposal rejected');
    })
    .catch(err => {
      console.log('Error in rejecting proposal');
    });

  }

  resolveProposal = () => {
    console.log('Resolve');
    if (this.state.contractInstance === null)
      return;

    var hash = keccak256(this.props.proposal.dataHash);
    console.log(this.props.proposal.index);
    console.log(hash);
    this.state.contractInstance.resolveProposal(
      this.props.proposal.index, hash,
      { from: this.context.web3.web3.eth.defaultAccount }
    )
    .then(() => {
      console.log('Proposal resolved');
    })
    .catch(err => {
      console.log('Error in resolving proposal');
    });
  }

  render() {
    if (this.props.proposal.reqStatus.toString() !== '0')
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
          Dati: {this.props.proposal.dataHash}
        </CardText>
        <this.ActionButtons />
      </Card>
    );
  }

  onExpand = () => {
    this.setState(previousState => ({isExpanded: !previousState.isExpanded}));
  }

}

Proposal.contextTypes = {
  web3: PropTypes.object
};

export default Proposal;
