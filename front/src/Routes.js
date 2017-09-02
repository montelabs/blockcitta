import React from 'react';

import {Route, IndexRedirect} from 'react-router';

import Master from 'components/Master';
import ResidenceCertificate from 'components/ResidenceCertificate';
import PuntoCittaAdm from 'components/PuntoCittaAdm';

const Routes = (
  <Route path='/' component={Master}> 
    <Route path='certificati'>
      <Route path=':type/:newOrVerify' component={ResidenceCertificate} />
    </Route>
    <Route path='richieste' component={PuntoCittaAdm} />
  </Route>
);

export default Routes;
