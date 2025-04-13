import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Muestra spinner mientras verifica el estado de auth
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 200px)' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login...');
    // Guarda la ruta a la que intentaba acceder para redirigir después del login
    return <Navigate to="/" state={{ from: location, openLogin: true }} replace />; // Redirige a home y pide abrir login
  }

  if (role && role === 'ADMIN' && !isAdmin) {
    console.log('ProtectedRoute: Not admin, redirecting to home...');
    // No tiene el rol requerido, redirige a la página principal
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, renderiza el componente hijo
  return children;
};

export default ProtectedRoute;