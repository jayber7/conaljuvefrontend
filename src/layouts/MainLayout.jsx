// src/layouts/MainLayout.jsx
import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, AppBar, Toolbar, Container, Typography, Link  } from '@mui/material'; // Importar AppBar, Toolbar
import NavbarActions from '../components/Layout/NavbarActions'; // Un nuevo componente para acciones navbar
import Footer from '../components/Layout/Footer';

import CompleteProfileModal from '../components/Auth/CompleteProfileModal';
import IncompleteProfileBanner from '../components/Layout/IncompleteProfileBanner';
import Sidebar, { drawerWidth } from '../components/Layout/Sidebar'; // Importar Sidebar y su ancho
import BannerSlider from '../components/Layout/BannerSlider'; // <-- 1. IMPORTAR SLIDER
import { useAuth } from '../contexts/AuthContext';
import logoConaljuve from '../assets/LogoCONALJUVE.png'; // Logo para AppBar superior
import { Link as RouterLink } from 'react-router-dom'; // Para el logo link

// --- Definir Altura del AppBar del Logo ---
const logoAppBarHeight = 50; // Ajusta esta altura según el tamaño de tu logo
const MainLayout = () => {
    const { user, isAuthenticated, loading } = useAuth();
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    const handleOpenProfileModal = useCallback(() => { setProfileModalOpen(true); }, []);
    const handleProfileModalClose = useCallback(() => { setProfileModalOpen(false); }, []);
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <CssBaseline />

            {/* --- AppBar Superior Fijo (Solo Logo y Acciones Derecha) --- */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)',
                    color: '#ffffff',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
                    height: `${logoAppBarHeight}px`
                }}
                elevation={0}
            >
                <Toolbar sx={{ justifyContent: 'space-between', minHeight: `${logoAppBarHeight}px !important` }}>
                    {/* Logo a la Izquierda */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <RouterLink to="/" style={{ display: 'flex', alignItems: 'center', textDecoration:'none' }}>
                           <Box
                                component="img"
                                sx={{ height: logoAppBarHeight * 0.75,
                                     width: 'auto',
                                     mr: 2 }}
                                alt="Logo CONALJUVE"
                                src={logoConaljuve}
                           />
                           <Typography
                                       variant="h5"
                                       noWrap
                                       sx={{
                                         display: { xs: 'none', md: 'block' },
                                         fontWeight: 700,
                                         color: '#ffffff',
                                         letterSpacing: '0.02em',
                                         textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                       }}
                                     >
                                         PLATAFORMA DIGITAL DE LAS JUNTAS VECINALES DE BOLIVIA
                           </Typography>
                        </RouterLink>
                    </Box>

                    {/* Acciones a la Derecha */}
                    <NavbarActions onOpenProfileModal={handleOpenProfileModal}/>
                </Toolbar>
            </AppBar>
            {/* --- Fin AppBar Superior --- */}


            {/* --- BARRA LATERAL FIJA --- */}
            {/* Ajustar padding top para que empiece DEBAJO del AppBar superior */}
            <Sidebar topOffset={logoAppBarHeight} />


            {/* --- CONTENEDOR PRINCIPAL (Derecha) --- */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    // Padding top para que el contenido empiece DEBAJO del AppBar superior
                    pt: `${logoAppBarHeight}px`,
                    pl: `${drawerWidth}px`, // Padding izquierdo igual al ancho del Sidebar
                    width: `calc(100% - ${drawerWidth}px)`,
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                }}
            >
                {/* --- 2. RENDERIZAR SLIDER AQUÍ --- */}
                 {/* Justo después del espacio del AppBar superior */}
                 <BannerSlider />
                 

                 {/* Área de Contenido Real de la Página */}
                 <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Outlet />
                 </Box>

                {/* Footer */}
                 <Footer />

            </Box>
            {/* --- FIN CONTENEDOR PRINCIPAL --- */}

            {/* --- Modales Globales --- */}
            <CompleteProfileModal
                open={profileModalOpen}
                onClose={handleProfileModalClose}
            />
        </Box>
    );
   
};

export default MainLayout;