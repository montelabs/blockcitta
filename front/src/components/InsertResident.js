import React, { Component } from 'react';

import {GridList, GridTile} from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import Snackbar from 'material-ui/Snackbar';

import PropTypes from 'prop-types'
import contract from 'truffle-contract';

import PuntoCittaJson from 'build/contracts/PuntoCitta.json';

import {instantiateContract} from 'utils/contract';

class InsertResident extends Component {
  constructor(props){
    super(props)
    this.state = {
      contractInstance: null,
      pubKey: '',
      resId: '',
      sentRequest: 0,
      snackMsg: ''
    }
  }

  sendAdd = () => {
    if (this.state.contractInstance === null)
      return;
    this.setState({ sentRequest: 1})
    this.state.contractInstance.addResident(this.state.pubKey, this.state.resId,
          { from: this.context.web3.web3.eth.defaultAccount })
    .then(() => {
      this.setState({ sentRequest: 2, snackMsg: 'Residente aggiunto' });
      console.log('Resident added');
    })
    .catch(err => {
      this.setState({ sentRequest: 3, snackMsg: 'Errore: residente non aggiunto' });
      console.log('Error adding resident: ' + err);
    })
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

  static gridListStyle = {
    marginTop:10,
  };

  SubmitButton = () => {
    if (this.state.sentRequest === 1)
      return <CircularProgress />
    return <RaisedButton onTouchTap={() => this.sendAdd()} type='submit' label={'Invia'} primary />
  }

  handleResId = (event, newValue) => {
    this.setState({resId: newValue});
  }

  handlePubKey = (event, newValue) => {
    this.setState({pubKey: newValue});
  }

  static gridListStyle = {
    marginTop:10,
  };

  handleSnackClose = () => {
    this.setState({ sentRequest: 0});
  }

  render(){
    return (
      <div>
        <GridList
          style={InsertResident.gridListStyle}
          cellHeight={'auto'}
          cols={2}
        >
          <GridTile>
            <TextField
              value={this.state.pubKey}
              fullWidth={true}
              name='pubKey'
              floatingLabelText='Chiave Pubblica'
              onChange={this.handlePubKey}
            />
          </GridTile>
          <GridTile>
            <TextField
              value={this.state.resId}
              fullWidth={true}
              name='resId'
              floatingLabelText='ID Residente'
              onChange={this.handleResId}
            />
          </GridTile>
        </GridList>
        <this.SubmitButton />
        <Snackbar
          open={this.state.sentRequest > 1}
          message={this.state.snackMsg}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackClose}
        />
      </div>
    )
  }
}

InsertResident.contextTypes = {
  web3: PropTypes.object
};

export default InsertResident;

