import React, { Component } from 'react'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import lodash from 'lodash';

class Proposal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false
    }
  }

  ReqType = () => {
    var _types = ['Certificato Domicilio', 'Contratto Locazione'];
    return _types[this.props.proposal.reqType];
  }

  ReqStatus = () => {
    var _status = ['Aperto', 'Risoluto', 'Respinto'];
    return _status[this.props.proposal.reqStatus];
  }

  ReqTitle = () => {
    var _t = this.ReqType() + ' (' + this.ReqStatus() + ')';
    return _t;
  }

  ResId = () => {
    var _i = 'ID Residente: ' + this.props.proposal.resId.toString();
    return _i;
  }

  ActionButtons = () => {
    if (!this.state.isExpanded)
      return null;

    return (
      <div
        style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}
      >
        <RaisedButton
          style={{margin: 20}}
          label="Falso"
          secondary={true}
          onTouchTap={() => this.rejectProposal()}
        />
        <RaisedButton
          style={{margin: 20}}
          label="Tutto OK"
          primary={true}
          onTouchTap={() => this.resolveProposal()}
        />
      </div>
    );
  }

  rejectProposal = () => {
    console.log('Reject');
  }

  resolveProposal = () => {
    console.log('Resolve');
  }

  render() {
    if (this.props.proposal.reqStatus.toString() !== '0')
      return null;

    return (
      <Card style={{marginRight: 80, marginBottom: 20}}
            onExpandChange={lodash.debounce(this.onExpand, 150)}
            expanded={this.state.isExpanded}
      >
        <CardHeader
          actAsExpander={true}
          showExpandableButton={true}
          title={this.ReqTitle()}
          subtitle={this.ResId()}
        />
        <CardText expandable={true}>
          Dati: {this.props.proposal.dataHash.toString()}
        </CardText>
        <this.ActionButtons />
      </Card>
    );
  }

  onExpand = () => {
    this.setState(previousState => ({isExpanded: !previousState.isExpanded}));
  }

}

export default Proposal;
