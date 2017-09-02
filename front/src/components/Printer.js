import React, { Component } from 'react';
import PrintTemplate from 'react-print';

class Printer extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  render() {
    const {name, birthday, sex, address, qrCode } = this.props;
    console.log(name, birthday, sex, address);

    return (
      <PrintTemplate>
        <div style={{marginLeft:-210}}>
          <h1>Certificato di Domicilio</h1>
          <h3>Il controllo di abitanti certifica che il signor {name}
            sta registratto nella comune di Chiasso con gli dati:
          </h3>
          <p>
            Nome: {name}<br />
            Nato il: {birthday}<br />
            sesso: {(sex === 'M') ? 'maschile' : 'feminile'}<br />
            Indirizo: Via {address}<br />
            La validità di questo documento deve venire atestata con
            il QRCode <qrCode />
          </p>
        </div>
      </PrintTemplate>
    )
  }
}
export default Printer;
