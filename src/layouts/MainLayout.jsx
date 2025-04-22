// src/layouts/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet /*, useNavigate*/ } from 'react-router-dom'; // useNavigate no es necesario aquí para esto
import { Box, Container } from '@mui/material';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import CompleteProfileModal from '../components/Auth/CompleteProfileModal';
import { useAuth } from '../contexts/AuthContext';

const MainLayout = () => {
  const { user, isAuthenticated, loading } = useAuth(); // Obtener estado completo
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Efecto para abrir modal si el usuario está logueado pero perfil incompleto
  useEffect(() => {
    console.log("MainLayout Effect:", { loading, isAuthenticated, user }); // <-- DEBUG LOG

    // Condiciones clave:
    // 1. Ya no debe estar cargando (loading === false)
    // 2. Debe estar autenticado (isAuthenticated === true)
    // 3. El objeto 'user' debe existir
    // 4. La propiedad 'isProfileComplete' en 'user' debe ser false
    if (!loading && isAuthenticated && user && user.isProfileComplete === false) {
      console.log("Condición cumplida: Abriendo modal Completar Perfil...");
      setProfileModalOpen(true);
    } else {
      // Opcional: Asegurarse de que esté cerrado en otros casos (aunque 'open' controla esto)
      // console.log("Condición NO cumplida o usuario ya completo/no auth/cargando.");
      // setProfileModalOpen(false); // Podría causar cierres inesperados si el usuario lo abre manualmente
    }

    // Las dependencias son correctas: este efecto se re-ejecuta cuando
    // cambia el estado de carga, autenticación o los datos del usuario.
  }, [isAuthenticated, user, loading]);

  const handleProfileModalClose = () => {
      console.log("Cerrando modal Completar Perfil...");
      setProfileModalOpen(false);
      // Considera qué pasa si el usuario cierra sin guardar y el perfil SIGUE incompleto.
      // ¿Debería volver a abrirse en la siguiente carga? La lógica actual lo haría.
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar /> {/* Navbar no necesita props para abrir modales aquí */}

      <Container component="main" maxWidth="lg" sx={{ /* ... estilos main container ... */ }}>
        <Outlet />
      </Container>

      <Footer />

      {/* Renderizar modal basado en el estado local */}
      {/* Asegúrate de que CompleteProfileModal exista y se importe correctamente */}
      <CompleteProfileModal
         open={profileModalOpen}
         onClose={handleProfileModalClose}
      />
    </Box>
  );
};

export default MainLayout;