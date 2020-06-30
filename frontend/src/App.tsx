import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Container from './templates/Container';
import Header from './templates/Header';
import SideBar from './templates/SideBar';
import Routes from './Routes';

const App: React.FC = () => (
  <Router>
    <Container>
      <Header />
      <SideBar />
      <Routes />
    </Container>
  </Router>
);

export default App;
