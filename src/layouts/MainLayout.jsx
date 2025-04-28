// src/layouts/MainLayout.jsx
import React, { useState, useEffect, useCallback  } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'; // useNavigate no es necesario aquí para esto
import { Box, Container } from '@mui/material';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import CompleteProfileModal from '../components/Auth/CompleteProfileModal';
import IncompleteProfileBanner from '../components/Layout/IncompleteProfileBanner'; // <-- Importar Banner
import { useAuth } from '../contexts/AuthContext';
import BannerSlider from '../components/Layout/BannerSlider'; // <-- IMPORTAR SLIDER

const EFFECTIVE_NAVBAR_HEIGHT = 90; // EJEMPLO: Ajusta este valor en píxeles

const MainLayout = () => {
  const { user, isAuthenticated, loading } = useAuth(); // Obtener estado completo
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  
  const handleOpenProfileModal = useCallback(() => {
    console.log("Abriendo modal Completar/Editar Perfil...");
    setProfileModalOpen(true);
}, []); // useCallback para que la referencia de la función sea estable

  // // Efecto para abrir modal si el usuario está logueado pero perfil incompleto
  // useEffect(() => {
  //   console.log("MainLayout Effect:", { loading, isAuthenticated, user }); // <-- DEBUG LOG

  //   // Condiciones clave:
  //   // 1. Ya no debe estar cargando (loading === false)
  //   // 2. Debe estar autenticado (isAuthenticated === true)
  //   // 3. El objeto 'user' debe existir
  //   // 4. La propiedad 'isProfileComplete' en 'user' debe ser false
  //   if (!loading && isAuthenticated && user && user.isProfileComplete === false) {
  //     console.log("Condición cumplida: Abriendo modal Completar Perfil...");
  //     setProfileModalOpen(true);
  //   } else {
  //     // Opcional: Asegurarse de que esté cerrado en otros casos (aunque 'open' controla esto)
  //     // console.log("Condición NO cumplida o usuario ya completo/no auth/cargando.");
  //     // setProfileModalOpen(false); // Podría causar cierres inesperados si el usuario lo abre manualmente
  //   }

  //   // Las dependencias son correctas: este efecto se re-ejecuta cuando
  //   // cambia el estado de carga, autenticación o los datos del usuario.
  // }, [isAuthenticated, user, loading]);

  const handleProfileModalClose = useCallback(() => {
      console.log("Cerrando modal Completar Perfil...");
      setProfileModalOpen(false);
      // Considera qué pasa si el usuario cierra sin guardar y el perfil SIGUE incompleto.
      // ¿Debería volver a abrirse en la siguiente carga? La lógica actual lo haría.
  },[]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onOpenProfileModal={handleOpenProfileModal} /> 
      <BannerSlider />
       {/* Contenido principal */}
      <Container
        component="main"
        maxWidth={false} 
        
        sx={{
          flexGrow: 1,
          width: '100%',
          // AJUSTAR PADDING/MARGIN SUPERIOR para que NO incluya altura del banner
          // El banner ahora está *encima* de este container
          pt: 4, // Padding superior DENTRO del container
          pb: 4, // Padding inferior DENTRO del container
          mt: `${EFFECTIVE_NAVBAR_HEIGHT}px`, // Margen superior para compensar SOLO el Navbar fijo
          px: { xs: 2, sm: 3, md: 4 } // Padding horizontal si maxWidth={false}
       }}
      >
       {/* --- Mostrar Banner si el perfil está incompleto --- */}
       {!loading && isAuthenticated && user && !user.isProfileComplete && (
        <Box sx={{ mb: 3 }}> {/* Añadir margen inferior al banner */}
          <IncompleteProfileBanner onOpenProfileModal={handleOpenProfileModal} />
        </Box>
      )}
      {/* --- Fin Banner --- */}
      
        <Outlet />
      </Container>

      <Footer />

      {/* Renderizar modal basado en el estado local */}
      {/* Asegúrate de que CompleteProfileModal exista y se importe correctamente */}
       {/* Modal de Completar/Editar Perfil */}
      <CompleteProfileModal
         open={profileModalOpen}
         onClose={handleProfileModalClose}
      />
    </Box>
  );
};

export default MainLayout;