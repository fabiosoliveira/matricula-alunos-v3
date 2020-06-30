import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Contant from './templates/Content';
// import ContantHeader from './templates/ContantHeader';
import Endereco from './views/Endereco';
import Responsavel from './views/Responsavel';
import Home from './views/Home';

const Routes: React.FC = () => (
  <Contant>
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/endereco">
        {/* <ContantHeader title="Endereço" small="Cadastro" /> */}
        <Endereco />
      </Route>
      <Route path="/responsavel">
        <Responsavel />
      </Route>
    </Switch>
  </Contant>
);

export default Routes;
