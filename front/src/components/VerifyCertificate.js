import React, { Component } from 'react';
import QrReader from 'react-qr-reader';

class VerifyCertificate extends Component {
  constructor(props){
    super(props)
    this.state = {
      qrCodeDelay: 100,
      qrCodeResult: 'No result',
    }
    this.handleScan = this.handleQRCodeScan.bind(this)
  }

  handleQRCodeScan(data){
    if (data !== null)
      this.setState({
        qrCodeResult: data,
      })
  }
  handleQRCodeError(err){
    console.error(err)
  }

  render(){
    const previewStyle = {
      height: 240,
      width: 320,
    }
    return(
      <div style={{marginLeft: 400}}>
        <QrReader
          delay={this.state.qrCodeDelay}
          style={previewStyle}
          onError={this.handleQRCodeError}
          onScan={this.handleScan}
          />
        <p>RESULT: {this.state.qrCodeResult}</p>
      </div>
    )
  }
}
export default VerifyCertificate;