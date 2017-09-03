import React, { Component } from 'react'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import {keccak256} from 'js-sha3';
import lodash from 'lodash';
import PropTypes from 'prop-types'
import contract from 'truffle-contract';

import PuntoCittaJson from 'build/contracts/PuntoCitta.json';
import {instantiateContract} from 'utils/contract';

class LawProposal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      contractInstance: null,
      signed: false,
      sentRequest: 0,
      snackMsg: ''
    }
  }

  componentWillMount() {
    this.instantiate();
  }

  async instantiate() {
    var _contract;
    var _signed;

    try {
      _contract = await instantiateContract(PuntoCittaJson, this.context.web3.web3.currentProvider);
      _signed = await _contract.hasSigned(this.context.web3.web3.eth.defaultAccount, this.props.lawProposal.index);
      let laterEvents = _contract.allEvents({
        fromBlock: 'latest',
        toBlock: 'latest'
      });
      laterEvents.watch((error, response) => {
        if (response.event === 'NewLawProposal') {
          _contract.lawProposals(response.args.propIdx.toNumber()).then(_p => {
            this.setState(previousState => {
              previousState.lawProposals.push({from: _p[0], title: _p[1], desc: _p[2], signs: _p[3], index: _p[4]});
            })
          });
        }
      });
      this.setState({contractInstance: _contract, signed: _signed});
    } catch(e) {
      console.log('Error: ' + e);
    }
  }

  sign = () => {
    if (this.state.signed)
      return;
    this.setState({ sentRequest: 1})
    this.state.contractInstance.signLawProposal(this.props.lawProposal.index,
          {from : this.context.web3.web3.eth.defaultAccount})
    .then(() => {
      this.setState({ signed: true, sentRequest: 2, snackMsg: 'Firmato' });
    })
    .catch(err => {
      this.setState({ sentRequest: 3, snackMsg: 'Errore: non firmato' });
      console.log('Error in signing law proposal: ' + err);
    });
  }

  ActionButtons = () => {
    if (!this.state.isExpanded)
      return null;

    if (this.state.sentRequest === 1)
      return (
        <div
          style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}
        >
          <CircularProgress style={{margin:20}}/>
        </div>
      );
    return (
      <div
        style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}
      >
        <RaisedButton
          style={{margin: 20}}
          label={this.state.signed ? 'Già firmato!' : 'Firmare'}
          primary={true}
          onTouchTap={() => this.sign()}
          disabled={this.state.signed}
        />
      </div>
    );
  }

  Firme = () => {
    return 'Firme: ' + this.props.lawProposal.signs.toString();
  }

  handleSnackClose = () => {
    this.setState({ sentRequest: 0});
  }

  render() {
    return (
      <Card style={{marginRight: 80, marginBottom: 20}}
            onExpandChange={lodash.debounce(this.onExpand, 150)}
            expanded={this.state.isExpanded}
      >
        <CardHeader
          actAsExpander={true}
          showExpandableButton={true}
          title={this.props.lawProposal.title}
          subtitle={this.Firme()}
        />
        <CardText expandable={true}>
          {this.props.lawProposal.desc}
        </CardText> 
        <this.ActionButtons />
        <Snackbar
          open={this.state.sentRequest > 1}
          message={this.state.snackMsg}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackClose}
        />
      </Card>
    );
  }

  onExpand = () => {
    this.setState(previousState => ({isExpanded: !previousState.isExpanded}));
  }

}

LawProposal.contextTypes = {
  web3: PropTypes.object
};

export default LawProposal;
