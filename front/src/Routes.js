import React from 'react';

import {Route, IndexRedirect} from 'react-router';

import Master from 'components/Master';
import ResidenceCertificate from 'components/ResidenceCertificate';

const Routes = (
  <Route path='/' component={Master}> 
    <Route path='certificati'>
      <Route path='domicilio' component={ResidenceCertificate} />
    </Route>
  </Route>
);

export default Routes;
