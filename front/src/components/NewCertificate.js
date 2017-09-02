import React, { Component } from 'react'

import {GridList, GridTile} from 'material-ui/GridList';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';

class NewCertificate extends Component {
  constructor(props){
    super(props)
    this.state = {
      sex: null,
      fullname: null
    }
  }

  static gridListStyle = {
    marginTop:10
  };

  handleFullNameChange = (event, value) => {
    console.log(value);
  }

  handleSexChange = (event, _, value) => {
    this.setState({sex: value});
  }

  formatDate = (date) => {
    console.log(date.getMonth())
    return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`;
  }

  render(){
    return(
      <form onSubmit={this.handleOnSubmit} >
        <div>
          <GridList
            style={NewCertificate.gridListStyle}
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
            style={NewCertificate.gridListStyle}
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
        </div>
        <RaisedButton type='submit' label='Invia' primary />
      </form>
    )
  }
}
export default NewCertificate;