import React from 'react';

import {Route, IndexRedirect} from 'react-router';

import Master from 'components/Master';

const Routes = (
  <Route path='/' component={Master}> 
    <IndexRedirect to="/" />
  </Route>
);

export default Routes;
