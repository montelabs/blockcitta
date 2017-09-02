import React, { Component } from 'react';

import {GridList, GridTile} from 'material-ui/GridList';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';

import QrReader from 'react-qr-reader';

import PropTypes from 'prop-types'
import contract from 'truffle-contract';

import PuntoCittaJson from 'build/contracts/PuntoCitta.json';

class ResidenceCertificate extends Component {
  constructor(props){
    super(props)
    this.state = {
      showQRCodeScanner: false,
      qrCodeDelay: 200,
      contractInstance: null
    }
    this.handleScan = this.handleQRCodeScan.bind(this)
  }

  sendRequest = () => {
    if (this.state.contractInstance === null)
      return;
  }

  componentWillMount() {
    this.instantiateContract();
  }

  async instantiateContract() {
    const pcContract = contract(PuntoCittaJson);
    pcContract.setProvider(this.context.web3.web3.currentProvider);
    var _contractInstance;
    try {
      _contractInstance = await pcContract.deployed();
    }
    catch(err) {
      console.error('Contract not deployed!');
      return;
    }
    this.setState({
      contractInstance: _contractInstance
    });
  }

  static gridListStyle = {
    marginTop:10,
  };
  static previewStyle = {
    height: 240,
    width: 320,
  }

  handleQRCodeScan(data){
    if (data !== null)
      this.setState({
        qrCodeResult: data,
        showQRCodeScanner: false
      })
  }
  handleQRCodeError(err){
    console.error(err)
  }

  handleScanQRCodePress = () => {
    this.setState({showQRCodeScanner: true});
    return null
  }

  getQRCode = (props) => {
    if (this.state.showQRCodeScanner) {
      return (
        <div> 
          <QrReader
            delay={this.state.qrCodeDelay}
            style={ResidenceCertificate.previewStyle}
            onError={this.handleQRCodeError}
            onScan={this.handleScan}
            />
          <p>RESULT: {this.state.qrCodeResult}</p>
        </div>
      )
    }
    if (!props.show){
      return null
    }
    return <RaisedButton
      onClick={this.handleScanQRCodePress}
      type='submit' 
      label='Scan QR-Code' 
      primary />
  }
  
  render(){
    const {type, newOrVerify} = this.props.params;
    console.log('Type:', type, 'newOrVerify:', newOrVerify);

    return (
      <div>
        <this.getQRCode show={true}/>
        <GridList
          style={ResidenceCertificate.gridListStyle}
          cellHeight={'auto'}
          cols={3}
        >
          <GridTile>
            <TextField
              fullWidth={true}
              name='fullname'
              floatingLabelText='Nome Completto'
              onChange={this.handleFullNameChange}
            />
          </GridTile>
          <GridTile>
            <DatePicker
              floatingLabelText='Data di nascita'
              container='inline'
              formatDate={this.formatDate}
            />
          </GridTile>
          <GridTile>
            <SelectField
              floatingLabelText='Sesso'
              value={this.state.sex}
              onChange={this.handleSexChange}
              style={{width:100}}
            >
              <MenuItem value={'M'} primaryText='M'/>
              <MenuItem value={'F'} primaryText='F'/>
            </SelectField>
          </GridTile>
        </GridList>

        <GridList
          style={ResidenceCertificate.gridListStyle}
          cellHeight={'auto'}
          cols={2}
        >
          <GridTile>
            <TextField
              fullWidth={true}
              name='fullname'
              floatingLabelText='Indirizzo (via, CAP e località)'
              onChange={this.handleAddress}
            />
          </GridTile>
          <GridTile>
            <TextField
              fullWidth={true}
              name='e-mail'
              floatingLabelText='e-mail'
              onChange={this.handleAddress}
            />
          </GridTile>
        </GridList>
        <RaisedButton
          onTouchTap={() => sendRequest()}
          type='submit'
          label={(newOrVerify === 'nuovo') ? 'Invia' : 'Verifica'} 
          primary={true}
        />
      </div>
    )

    // if (newOrVerify === 'nuovo')
    //   return(
    //     <NewCertificate />
    //   )
    // else if (newOrVerify === 'verificare') 
    //   return(
    //     <VerifyCertificate />
    //   )
  }
}

ResidenceCertificate.contextTypes = {
  web3: PropTypes.object
};

export default ResidenceCertificate;

