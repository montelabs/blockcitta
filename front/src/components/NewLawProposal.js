import React, { Component } from 'react';

import {GridList, GridTile} from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

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
      description: ''
    }
  }

  sendAdd = () => {
    if (this.state.contractInstance === null)
      return;

    this.state.contractInstance.addLawProposal(this.state.title, this.state.description,
          { from: this.context.web3.web3.eth.defaultAccount })
    .then(() => {
      console.log('Law proposal added');
    })
    .catch(err => {
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
              value={this.state.pubKey}
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
      </div>
    )
  }
}

NewLawProposal.contextTypes = {
  web3: PropTypes.object
};

export default NewLawProposal;

