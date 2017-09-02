import React, { Component } from 'react';
import NewCertificate from 'components/NewCertificate';
import VerifyCertificate from 'components/VerifyCertificate';

class ResidenceCertificate extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }
  
  render(){
    const {type, newOrVerify} = this.props.params;
    console.log('Type:', type, 'newOrVerify:', newOrVerify);

    if (newOrVerify === 'nuovo') 
      return(
        <NewCertificate />
      )
    else if (newOrVerify === 'verificare') 
      return(
        <VerifyCertificate />
      )
  }
}
export default ResidenceCertificate;