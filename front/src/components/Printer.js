import React, { Component } from 'react';
import PrintTemplate from 'react-print';
import QRCodeWriter from './qrcodeC/src';

class Printer extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  render() {
    const {name, birthDate, sex, address, encodedString } = this.props;
    return (
      <PrintTemplate>
        <div style={{marginLeft:-210}}>
          <h1>Certificato di Domicilio</h1>
          <h3>Il controllo di abitanti certifica che il signor {name}
            sta registratto nella comune di Chiasso con gli dati:
          </h3>
          <p>
            Nome: {name}<br />
            Nato il: {birthDate}<br />
            sesso: {(sex === 'M') ? 'maschile' : 'feminile'}<br />
            Indirizo: Via {address}<br />
            La validità di questo documento deve venire atestata con
            il QRCode: </p>
            <QRCodeWriter
              size= {200}
              value={encodedString} 
              shiftTiles={3}
              />
        </div>
      </PrintTemplate>
    )
  }
}
export default Printer;
