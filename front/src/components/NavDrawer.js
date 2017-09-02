import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import Divider from 'material-ui/Divider';
import { zIndex } from 'material-ui/styles';

import _ from 'lodash';

const SelectableList = makeSelectable(List);

class NavDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUnfeatured: false
    };
  }

  Navigations = () => {
    const {
      location,
      onRequestChangeNavDrawer,
      onChangeList
    } = this.props;

    let newOrVerify = [
      <ListItem 
        key='Domicilio'
        value='/certificati/domicilio/nuovo'
        href='#/certificati/domicilio/nuovo'
        primaryText='Nuovo'
      />,
      <ListItem 
        key='Domicilio'
        value='/certificati/domicilio/verificare'
        href='#/certificati/domicilio/verificare'
        primaryText='Verificare'
      />
    ]
    return <Drawer
      open={true}
      docked={true}
      onRequestChange={onRequestChangeNavDrawer}
      containerStyle={{zIndex: zIndex.drawer - 100}}
    >
      <AppBar
        title='BlockCitta'
        showMenuIconButton={false} />
      <SelectableList
        value={location.pathname}
        onChange={onChangeList}
      >
      <ListItem
        primaryTogglesNestedList={true}
        primaryText='Certificati'
        nestedItems={[
          <ListItem key='Domicilio'
            primaryTogglesNestedList={true}
            primaryText='Domicilio'
            nestedItems={newOrVerify}
          />
        ]}
      />
      </SelectableList>
    </Drawer>
  }
  render() {
    return <this.Navigations />
  }
}

export default NavDrawer;
