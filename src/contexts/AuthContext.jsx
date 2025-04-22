// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    console.log("AuthContext: Iniciando fetchUser...");
    // Intentar obtener token JWT (si aún soportas login con JWT)
    const token = localStorage.getItem('authToken'); // Leer token
    if (token) {
       console.log("AuthContext: Token JWT encontrado, estableciendo header.");
       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
         console.log("AuthContext: No se encontró token JWT en localStorage.");
         // Asegurarse de que no quede un header viejo si el token se borró
         delete api.defaults.headers.common['Authorization'];
    }

    // --- MODIFICACIÓN: Intentar SIEMPRE llamar a /api/auth/me ---
    // El backend determinará si está autenticado por sesión o por token (si protect lo maneja)
    try {
      console.log("AuthContext: Intentando fetch /api/auth/me...");
      // IMPORTANTE: api (axios instance) debe estar configurado con withCredentials: true
      // si dependes de cookies de sesión. Revisa tu src/services/api.js
      const response = await api.get('/auth/me'); // Esta llamada enviará la cookie de sesión si existe
      console.log("AuthContext: Respuesta de /api/auth/me:", response.data);
      // Si la llamada es exitosa (200 OK), significa que está autenticado
      setUser(response.data); // Establecer usuario (viene del backend)
      console.log("AuthContext: Estado 'user' establecido.");

      // Opcional: Si /me también devuelve un token (para unificar), guárdalo
      // if (response.data.token) {
      //    localStorage.setItem('authToken', response.data.token);
      //    api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      // }

    } catch (error) {
      // Si /api/auth/me falla (ej. 401), significa que no está autenticado
      console.error("AuthContext: Error fetching /api/auth/me (probablemente no autenticado):", error.response?.status, error.response?.data?.message || error.message);
      // Limpiar cualquier dato residual
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
      setUser(null); // Asegurar que user sea null
    } finally {
        console.log("AuthContext: fetchUser finalizado, setLoading(false).");
        setLoading(false); // Terminar carga en cualquier caso
    }
    // --- FIN MODIFICACIÓN ---
  }, []);


  useEffect(() => {
      console.log("AuthProvider mounted. Ejecutando fetchUser...");
      fetchUser();
  }, [fetchUser]); // fetchUser ya no cambia, pero mantener dependencia es buena práctica

  // --- login (Basado en JWT - mantener si necesitas login con credenciales) ---
  const login = async (credentials) => { /* ... como antes ... */ };

  // --- register (probablemente obsoleto si solo usas FB login) ---
  // const register = async (userData) => { /* ... */ };

  // --- logout (Debe limpiar sesión del backend si es posible) ---
  const logout = useCallback(async () => { // Hacerla async
    console.log("Logging out...");
    try {
        // Llamar al endpoint de logout del backend para destruir la sesión
        await api.post('/auth/logout');
        console.log("Logout en backend exitoso.");
    } catch (error) {
        console.error("Error llamando a /auth/logout del backend:", error.response?.data?.message || error.message);
        // Continuar con la limpieza del frontend de todos modos
    } finally {
        // Limpieza Frontend
        localStorage.removeItem('authToken'); // Limpiar token si lo usas
        delete api.defaults.headers.common['Authorization']; // Limpiar header
        setUser(null); // Limpiar estado local
        console.log("Estado local y token limpiados.");
        // Considera redirigir aquí o en el componente que llamó a logout
        // navigate('/');
    }
  }, []); // Añadir dependencias si usa algo externo (ej. navigate)

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isStaff: user?.role === 'ADMIN' || user?.role === 'STAFF',
    loading,
    login, // Mantener si aún ofreces login JWT
    logout,
    // register, // Quitar si ya no se usa
    refetchUser: fetchUser
  };

  return ( <AuthContext.Provider value={value}> {children} </AuthContext.Provider> );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
   if (context === undefined) {
       throw new Error('useAuth must be used within an AuthProvider');
   }
  return context;
};