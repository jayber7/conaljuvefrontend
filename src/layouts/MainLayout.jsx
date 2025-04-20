import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from '../components/Layout/Navbar'; // Crear este componente
import Footer from '../components/Layout/Footer'; // Crear este componente
import LoginModal from '../components/Auth/LoginModal'; // Crear este componente
import RegisterModal from '../components/Auth/RegisterModal'; // Crear este componente

const MainLayout = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Efecto para abrir el modal de login si viene de ProtectedRoute
  useEffect(() => {
    if (location.state?.openLogin) {
      setLoginOpen(true);
      // Limpiar el estado para que no se abra de nuevo en recargas
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);


  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);
  const handleRegisterOpen = () => setRegisterOpen(true);
  const handleRegisterClose = () => setRegisterOpen(false);

  // Función para cambiar de modal Registro -> Login
  const switchToLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

   // Función para cambiar de modal Login -> Registro
  const switchToRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const NAVBAR_HEIGHT = 64; // Ejemplo, ajusta si tu AppBar es más alto

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onLoginClick={handleLoginOpen} onRegisterClick={handleRegisterOpen} />

      {/* Contenido principal con padding */}
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4,  mt: `${NAVBAR_HEIGHT}px`,pt: 4, position: 'relative',zIndex: 1  /* Padding vertical */ }}>
        <Outlet /> {/* Aquí se renderizan las páginas */}
      </Container>

      <Footer />

      {/* Modales de Autenticación */}
      <LoginModal
         open={loginOpen}
         onClose={handleLoginClose}
         onSwitchToRegister={switchToRegister} // Pasar función para cambiar
      />
      <RegisterModal
        open={registerOpen}
        onClose={handleRegisterClose}
        onSwitchToLogin={switchToLogin} // Pasar función para cambiar
       />
    </Box>
  );
};

export default MainLayout;