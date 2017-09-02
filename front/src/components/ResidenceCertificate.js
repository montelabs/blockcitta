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

import {instantiateContract} from 'utils/contract';

class ResidenceCertificate extends Component {
  constructor(props){
    super(props)
    this.state = {
      showQRCodeScanner: false,
      qrCodeDelay: 200,
      contractInstance: null,
      name: '',
      birthDate: '',
      sex: '',
      address: '',
      email: ''
    }
    this.handleScan = this.handleQRCodeScan.bind(this)
  }

  dataString = () => {
    var _data = this.state.name + ' / ' +
                this.state.birthDate + ' / ' +
                this.state.sex + ' / ' +
                this.state.address + ' / ' +
                this.state.email;
    return _data;
  }

  sendRequest = () => {
    if (this.state.contractInstance === null)
      return;

    this.state.contractInstance.addProposal(0, this.dataString(),
          { from: this.context.web3.web3.eth.defaultAccount })
    .then(() => {
      console.log('Proposal added');
    })
    .catch(err => {
      console.log('Error sending proposal: ' + err);
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
  static previewStyle = {
    height: 240,
    width: 320,
  }
  
  formatDate = (date) => {
    let month = (date.getMonth()+1).toString();
    let day = (date.getDate()).toString();
    if (month.length === 1)
      month = '0' + month;
    if (day.length === 1)
      day = '0' + day;
    return `${day}.${month}.${date.getFullYear()}`;
  }

  handleSexChange = (event, _, sex) => {
    this.setState({sex: sex});
  }

  handleQRCodeScan(data){
    if (data !== null) {
      let QRCodeData = data.split('-');
      this.setState({
        qrCodeResult: data,
        showQRCodeScanner: false
      })
    }
  }

  handleQRCodeError(err){
    console.error(err)
  }

  handleScanQRCodePress = () => {
    this.setState({showQRCodeScanner: true});
    return null
  }

  getQRCode = () => {
    if (this.props.params.newOrVerify === 'nuovo'){
      return null
    }
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
    return <RaisedButton
      onClick={this.handleScanQRCodePress}
      type='submit' 
      label='Scan QR-Code' 
      primary />
  }

  SubmitButton = () => {
    if (this.props.params.newOrVerify === 'nuovo')
      return <RaisedButton onTouchTap={() => this.sendRequest()} type='submit' label={'Nuovo'} primary />
    return null;
  }

  handleFullNameChange = (event, newValue) => {
    this.setState({name: newValue});
  }

  handleAddress = (event, newValue) => {
    this.setState({address: newValue});
  }

  handleEmail = (event, newValue) => {
    this.setState({email: newValue});
  }

  handleDate = (event, newDate) => {
    this.setState({birthDate: newDate});
  }

  handleSexChange = (event, key) => {
    var _s = null;
    if (key === 0)
      _s = 'M';
    else if (key === 1)
      _s = 'F';
    else
      return;
    this.setState({sex: _s});
  }

  render(){
    const {type, newOrVerify} = this.props.params;
    console.log('Type:', type, 'newOrVerify:', newOrVerify);

    return (
      <div>
        <this.getQRCode/>
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
              onChange={this.handleDate}
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
          cols={3}
        >
          <GridTile>
            <TextField
              fullWidth={true}
              name='address'
              floatingLabelText='Indirizzo (via, CAP e località)'
              onChange={this.handleAddress}
            />
          </GridTile>
          <GridTile>
            <TextField
              fullWidth={true}
              name='email'
              floatingLabelText='e-mail'
              onChange={this.handleEmail}
            />
          </GridTile>
        </GridList>
        <this.SubmitButton />
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

