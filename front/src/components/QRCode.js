import React, { Component } from 'react'
import QrReader from 'react-qr-reader'

class QRCode extends Component {
  constructor(props){
    super(props)
    this.state = {
      delay: 100,
      result: 'No result',
    }

    this.handleScan = this.handleScan.bind(this)
  }
  handleScan(data){
    if (data !== null)
      this.setState({
        result: data,
      })
  }
  handleError(err){
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
          delay={this.state.delay}
          style={previewStyle}
          onError={this.handleError}
          onScan={this.handleScan}
          />
        <p>RESULT: {this.state.result}</p>
      </div>
    )
  }
}
export default QRCode;