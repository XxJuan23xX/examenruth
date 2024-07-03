import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles.css';
import App from './App';
import '@fortawesome/fontawesome-free/css/all.min.css';

const container = document.getElementById('root');
const root = createRoot(container); // Crear un root en lugar de usar ReactDOM.render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
