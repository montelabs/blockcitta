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

class Request extends Component {
  constructor(props) {
    super(props);
    var _data = props.request.dataHash.split('/');
    this.state = {
      isExpanded: false,
      contractInstance: null,
      name: _data[0],
      birthDate: _data[1],
      sex: _data[2],
      address: _data[3],
      sentRequestFalse: 0,
      sentRequestOk: 0,
      snackMsgFalse: '',
      snackMsgOk: ''
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

  ButtonFalse = () => {
    if (this.state.sentRequestFalse === 1)
      return <CircularProgress style={{margin: 20}}/>

    return (
      <RaisedButton
        style={{margin: 20}}
        label="Falso"
        secondary={true}
        onTouchTap={() => this.rejectRequest()}
      />
    );
  }

  ButtonOk = () => {
    if (this.state.sentRequestOk === 1)
      return <CircularProgress style={{margin: 20}}/>

    return (
      <RaisedButton
        style={{margin: 20}}
        label="Tutto OK"
        primary={true}
        onTouchTap={() => this.resolveRequest()}
      />
    );
  }

  ActionButtons = () => {
    if (!this.state.isExpanded)
      return null;

    return (
      <div
        style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}
      >
        <this.ButtonFalse />
        <this.ButtonOk />
      </div>
    );
  }

  rejectRequest = () => {
    console.log('Reject');
    this.setState({ sentRequestFalse: 1})
    this.state.contractInstance.rejectRequest(
      this.props.request.index,
      { from: this.context.web3.web3.eth.defaultAccount }
    )
    .then(() => {
      this.setState({ sentRequestFalse: 2, snackMsgFalse: 'Request rejected' });
      console.log('Request rejected');
    })
    .catch(err => {
      this.setState({ sentRequestFalse: 3, snackMsgFalse: 'Error: request could not be rejected' });
      console.log('Error in rejecting request');
    });

  }

  resolveRequest = () => {
    console.log('Resolve');
    if (this.state.contractInstance === null)
      return;

    var _split = this.props.request.dataHash.split('/');
    var _data = _split[0] + '/' + _split[1] + '/' + _split[2] + '/' + _split[3];
    
    this.setState({ sentRequestOk: 1})
    var hash = keccak256(_data);
    this.state.contractInstance.resolveRequest(
      this.props.request.index, hash,
      { from: this.context.web3.web3.eth.defaultAccount }
    )
    .then(() => {
      this.setState({ sentRequestOk: 2, snackMsgOk: 'Request resolved' });
      console.log('Request resolved');
    })
    .catch(err => {
      this.setState({ sentRequestOk: 3, snackMsgOk: 'Error: request could not be resolved' });
      console.log('Error in resolving request');
    });
  }

  handleSnackClose = () => {
    this.setState({ sentRequestFalse: 0, sentRequestOk: 0});
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
          <Table selectable={false}>
            <TableBody displayRowCheckbox={false}>
              <TableRow displayBorder={false}>
                <TableRowColumn style={{fontSize: 16}}>Nome: {this.state.name}</TableRowColumn>
                <TableRowColumn style={{fontSize: 16}}>Data di Nascita: {this.state.birthDate}</TableRowColumn>
                <TableRowColumn style={{fontSize: 16}}>Sesso: {this.state.sex}</TableRowColumn>
              </TableRow>
              <TableRow displayBorder={false}>
                <TableRowColumn colSpan='3' style={{fontSize: 16}}>Indirizzo: {this.state.address}</TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </CardText>
        <this.ActionButtons />
        <Snackbar
          open={this.state.sentRequestFalse > 1}
          message={this.state.snackMsgFalse}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackClose}
        />
        <Snackbar
          open={this.state.sentRequestOk > 1}
          message={this.state.snackMsgOk}
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

Request.contextTypes = {
  web3: PropTypes.object
};

export default Request;
