import React from 'react';

import {Route, IndexRedirect} from 'react-router';

import Master from 'components/Master';
import ResidenceCertificate from 'components/ResidenceCertificate';
import PuntoCittaAdm from 'components/PuntoCittaAdm';
import InsertResident from 'components/InsertResident';

const Routes = (
  <Route path='/' component={Master}> 
    <Route path='certificati'>
      <Route path=':type/:newOrVerify' component={ResidenceCertificate} />
    </Route>
    <Route path='richieste' component={PuntoCittaAdm} />
    <Route path='inserire' component={InsertResident} />
  </Route>
);

export default Routes;
