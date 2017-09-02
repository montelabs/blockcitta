import React, { Component } from 'react'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

class Proposal extends Component {
  constructor(props) {
    super(props);
    console.log(props);
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

  render() {
    if (this.props.proposal.reqStatus.toString() !== '0')
      return null;

    return (
      <Card style={{marginRight: 80, marginBottom: 20}}>
        <CardHeader
          actAsExpander={true}
          showExpandableButton={true}
          title={this.ReqTitle()}
        />
        <CardText expandable={true}>
          {this.props.proposal.resId.toString()}
          {this.props.proposal.dataHash.toString()}
        </CardText>
      </Card>
    );
  }

}

export default Proposal;
