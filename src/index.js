// react
import React from 'react';
import ReactDOM from 'react-dom';

// routing
import { BrowserRouter as Router } from 'react-router-dom';

// redux
import { store, persistor } from './redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// components
import App from './App';

// chakra ui
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from './Themes/theme.chakra.js';

// css
import './index.css';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <PersistGate persistor={persistor}>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <App />
        </ChakraProvider>
      </PersistGate>
    </Router>
  </Provider>,
  document.getElementById('root')
);
