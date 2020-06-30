import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import DrawerProvider from './contexts/drawer';

ReactDOM.render(
  <DrawerProvider>
    <App />
  </DrawerProvider>,
  document.getElementById('root'),
);
