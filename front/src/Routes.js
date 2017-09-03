import React from 'react';

import {Route, IndexRedirect} from 'react-router';

import Master from 'components/Master';
import ResidenceCertificate from 'components/ResidenceCertificate';
import PuntoCittaAdm from 'components/PuntoCittaAdm';
import InsertResident from 'components/InsertResident';
import LawProposalList from 'components/LawProposalList';
import NewLawProposal from 'components/NewLawProposal';

const Routes = (
  <Route path='/' component={Master}> 
    <Route path='certificati'>
      <Route path=':type/:newOrVerify' component={ResidenceCertificate} />
    </Route>
    <Route path='richieste' component={PuntoCittaAdm} />
    <Route path='inserire' component={InsertResident} />
    <Route path='legge'>
      <Route path='lista' component={LawProposalList} />
      <Route path='nuova' component={NewLawProposal} />
    </Route>
  </Route>
);

export default Routes;
