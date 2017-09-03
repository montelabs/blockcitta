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

class NewLawProposal extends Component {
  constructor(props){
    super(props)
    this.state = {
      contractInstance: null,
      title: '',
      description: '',
      sentRequest: 0,
      snackMsg: ''
    }
  }

  sendAdd = () => {
    if (this.state.contractInstance === null)
      return;
    this.setState({ sentRequest: 1})
    this.state.contractInstance.addLawProposal(this.state.title, this.state.description,
          { from: this.context.web3.web3.eth.defaultAccount })
    .then(() => {
      this.setState({ sentRequest: 2, snackMsg: 'Law proposal added' });
      console.log('Law proposal added');
    })
    .catch(err => {
      this.setState({ sentRequest: 3, snackMsg: 'Error: could not add law proposal' });
      console.log('Error adding law proposal: ' + err);
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

  handleTitle = (event, newValue) => {
    this.setState({title: newValue});
  }

  handleDescription = (event, newValue) => {
    this.setState({description: newValue});
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
          style={NewLawProposal.gridListStyle}
          cellHeight={'auto'}
          cols={1.2}
        >
          <GridTile>
            <TextField
              value={this.state.title}
              fullWidth={true}
              name='title'
              floatingLabelText='Titolo'
              onChange={this.handleTitle}
            />
          </GridTile>
          <GridTile rows={3}>
            <TextField
              multiLine={true}
              rows={3}
              rowsMax={4}
              value={this.state.description}
              fullWidth={true}
              name='description'
              floatingLabelText='Descrizione'
              onChange={this.handleDescription}
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

NewLawProposal.contextTypes = {
  web3: PropTypes.object
};

export default NewLawProposal;

