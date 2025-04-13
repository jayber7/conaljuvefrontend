import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Importa tu tema
import { AuthProvider } from './contexts/AuthContext'; // Importa tu AuthProvider

// Opcional: Si quieres CSS global adicional
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normaliza y aplica fondo del tema */}
      <BrowserRouter>
        <AuthProvider> {/* Envuelve TODO con AuthProvider */}
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);