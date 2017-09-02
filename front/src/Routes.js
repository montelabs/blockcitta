import React from 'react';

import {Route, IndexRedirect} from 'react-router';

import Master from 'components/Master';
import QRCode from 'components/QRCode';

const Routes = (
  <Route path='/' component={Master}> 
    <Route path='qrcode' component={QRCode} />
  </Route>
);

export default Routes;
