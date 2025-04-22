// src/components/Auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, roles }) => {
  // Obtener loading, isAuthenticated, y user del contexto
  const { isAuthenticated, user, loading } = useAuth(); // <-- Asegúrate de obtener 'user' también
  const location = useLocation();

  // --- PASO 1: MOSTRAR SPINNER MIENTRAS CARGA ---
  if (loading) {
    // Todavía estamos verificando la sesión/token inicial
    console.log("ProtectedRoute: Auth context cargando..."); // Log de depuración
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 200px)' }}>
        <CircularProgress />
      </Box>
    );
  }
  // --- FIN PASO 1 ---

  // --- PASO 2: VERIFICAR AUTENTICACIÓN (SOLO DESPUÉS DE CARGAR) ---
  if (!isAuthenticated) {
    // Ahora que loading es false, sabemos que realmente no está autenticado
    console.log('ProtectedRoute: Auth cargado, NO autenticado. Redirigiendo...');
    // Redirige a la página principal, pasando la intención de abrir login (aunque ya no exista el modal)
    // Podrías quitar 'openLogin: true' si ya no usas esa lógica en MainLayout
    return <Navigate to="/" state={{ from: location /*, openLogin: true*/ }} replace />;
  }
  // --- FIN PASO 2 ---

  // --- PASO 3: VERIFICAR ROL (SI APLICA) ---
  // Si está autenticado, verifica los roles requeridos
  if (roles && roles.length > 0 && (!user || !roles.includes(user.role))) { // Verifica que user exista antes de acceder a user.role
     console.warn(`ProtectedRoute: Acceso denegado. Requiere rol: ${roles.join(' o ')}. Usuario tiene: ${user?.role}`);
     return <Navigate to="/" replace />; // Redirigir a inicio si el rol no es correcto
  }
  // --- FIN PASO 3 ---

  // Si pasó todas las verificaciones (cargado, autenticado, rol correcto) -> Mostrar contenido protegido
  console.log("ProtectedRoute: Acceso permitido.");
  return children;
};

export default ProtectedRoute;