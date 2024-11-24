import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './css/style.css';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { PrimeReactProvider } from 'primereact/api';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <PrimeReactProvider>
          <App />
        </PrimeReactProvider>
      </Provider>
    </Router>
  </React.StrictMode>,
);
