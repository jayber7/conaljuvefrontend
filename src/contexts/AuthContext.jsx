import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado inicial de carga

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
       // Re-establecer header por si acaso se perdió en recarga
       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
       try {
           // Verifica el token con el backend y obtiene datos frescos
           const response = await api.get('/auth/me');
           setUser(response.data);
       } catch (error) {
           console.error("Error fetching user data:", error.response?.data?.message || error.message);
           localStorage.removeItem('authToken');
           delete api.defaults.headers.common['Authorization'];
           setUser(null); // Asegura que el usuario quede como null
       }
    }
    setLoading(false); // Termina la carga inicial
  }, []);


  useEffect(() => {
      console.log("AuthProvider mounted. Fetching user...");
      fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    try {
        setLoading(true);
        const response = await api.post('/auth/login', credentials);
        const { token, ...userData } = response.data; // El backend debería devolver user + token
        localStorage.setItem('authToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        setLoading(false);
        return { success: true, user: userData };
    } catch (error) {
        setLoading(false);
        console.error("Login failed:", error.response?.data?.message || error.message);
        // Devuelve el mensaje de error del backend si existe
        throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const register = async (userData) => {
     try {
        setLoading(true);
        // Llama al endpoint de registro
        await api.post('/auth/register', userData);
        setLoading(false);
        // Podrías hacer login automático aquí o simplemente mostrar éxito
        return { success: true };
     } catch (error) {
         setLoading(false);
         console.error("Registration failed:", error.response?.data?.message || error.message);
         throw new Error(error.response?.data?.message || 'Error al registrarse');
     }
  };

  const logout = useCallback(() => {
    console.log("Logging out...");
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    // No forzar redirección aquí, dejar que los componentes decidan
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    loading, // Exportar estado de carga
    login,
    logout,
    register,
    refetchUser: fetchUser // Función para recargar datos del usuario si es necesario
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
   if (context === undefined) {
       throw new Error('useAuth must be used within an AuthProvider');
   }
  return context;
};