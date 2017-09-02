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
          <h3> Il controllo di abitanti certifica che lo sottoscritto(a)
            sta registratto nel comune di Chiasso con i seguenti dati:
          </h3>
          <p>
            Nome: {name}<br />
            Nato il: {birthDate}<br />
            Sesso: {(sex === 'M') ? 'maschile' : 'feminile'}<br />
            Indirizzo: {address}<br />
            La validità di questo documento deve essere verificata tramite
            il QRCode oppure compilando i dati nei rispettivi campi.</p>
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
