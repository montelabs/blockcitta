import React, { Component } from 'react';

import {GridList, GridTile} from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

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
      resId: ''
    }
  }

  sendAdd = () => {
    if (this.state.contractInstance === null)
      return;

    this.state.contractInstance.addResident(this.state.pubKey, this.state.resId,
          { from: this.context.web3.web3.eth.defaultAccount })
    .then(() => {
      console.log('Resident added');
    })
    .catch(err => {
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
      </div>
    )
  }
}

InsertResident.contextTypes = {
  web3: PropTypes.object
};

export default InsertResident;

