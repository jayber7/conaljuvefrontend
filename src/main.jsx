import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Importa tu tema
import { AuthProvider } from './contexts/AuthContext'; // Importa tu AuthProvider
import { GoogleOAuthProvider } from '@react-oauth/google';
//import './index.css'; //css global
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Opcional: Si quieres CSS global adicional

// Obtener Client ID desde variables de entorno (¡IMPORTANTE!)
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!googleClientId) {
  console.error("ERROR: Variable de entorno VITE_GOOGLE_CLIENT_ID no está definida.");
  // Podrías mostrar un mensaje de error o detener la carga
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
   <GoogleOAuthProvider clientId={googleClientId || "658571267975-7tc4100lau4qn7j0sk2nb9i8013o6u3m.apps.googleusercontent.com"}>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normaliza y aplica fondo del tema */}
      <BrowserRouter>
        <AuthProvider> {/* Envuelve TODO con AuthProvider */}
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </GoogleOAuthProvider>
  </React.StrictMode>,
);