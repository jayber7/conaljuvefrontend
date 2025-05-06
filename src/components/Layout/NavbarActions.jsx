// src/components/Layout/NavbarActions.jsx
import React, { useState } from 'react';
import { Box, Button, IconButton, Menu, MenuItem, Avatar, Tooltip, Divider, Typography } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
// Importar iconos necesarios
import GoogleIcon from '@mui/icons-material/Google';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person'; // Para fallback avatar
import { useGoogleLogin } from '@react-oauth/google';
import api from '../../services/api';


const NavbarActions = ({ onOpenProfileModal }) => {
    const { isAuthenticated, user, isAdmin, isStaff, logout, refetchUser } = useAuth();
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);
    const handleLogout = () => { logout(); handleCloseUserMenu(); /* navigate('/'); ya no es necesario aquí */ };
    const handleNavigate = (path) => { handleCloseUserMenu(); navigate(path); };

    // Lógica Google Login (copiada de Navbar anterior)
    const handleGoogleLoginSuccess = async (googleResponse) => {
        if (googleResponse.code) {
             console.log("Enviando código Google a backend...");
             try {
                 const { data } = await api.post('/auth/google/verify-code', { code: googleResponse.code });
                 if (data.token && data.user) {
                     localStorage.setItem('authToken', data.token);
                     api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                     await refetchUser();
                 } else { alert("Error procesando login (BE)."); }
             } catch (error) { alert(`Error al iniciar sesión con Google: ${error.response?.data?.message || 'Error servidor'}`); }
        } else { alert("Error inesperado login Google."); }
    };
    const handleGoogleLoginError = (error) => { console.error(error); alert('Login Google falló.'); };
    const googleLogin = useGoogleLogin({ flow: 'auth-code', onSuccess: handleGoogleLoginSuccess, onError: handleGoogleLoginError });

    const getInitials = (name) => { /* ... función para obtener iniciales ... */ };
    const userInitials = getInitials(user?.name);

    return (
        <Box 

        >
            {isAuthenticated && user ? (
                <>
                    <Tooltip title="Abrir menú">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar
                                alt={user.name || user.username}
                                src={user.profilePictureUrl || undefined}
                                sx={{
                                    bgcolor: user.profilePictureUrl ? 'transparent' : 'secondary.main', // Color de fondo solo si NO hay imagen
                                    width: 32, height: 32, fontSize: '0.8rem'
                                }}
                            >
                                {!user.profilePictureUrl && userInitials}
                            </Avatar>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar-user"
                        anchorEl={anchorElUser}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem disabled sx={{ '&.Mui-disabled': { opacity: 1 }, pt: 1, pb: 0 }}><Typography variant="caption" color="textSecondary">Conectado como:</Typography></MenuItem>
                        <MenuItem disabled sx={{ '&.Mui-disabled': { opacity: 1, color: 'text.primary', fontWeight: 500 }, pt: 0 }}>{user.name || user.username}</MenuItem>
                        <Divider />
                        {!user.isProfileComplete && ( <MenuItem onClick={() => { handleCloseUserMenu(); onOpenProfileModal(); }}><WarningAmberIcon sx={{ mr: 1, color: 'warning.main' }} fontSize="small"/> Completar Perfil</MenuItem> )}
                        {user.isProfileComplete && ( <MenuItem onClick={() => { handleCloseUserMenu(); onOpenProfileModal(); }}><EditIcon sx={{ mr: 1 }} fontSize="small"/> Editar Perfil</MenuItem> )}
                        {(isAdmin || isStaff) && ( <MenuItem onClick={() => handleNavigate('/admin')}><AdminPanelSettingsIcon sx={{ mr: 1 }}/> Administración</MenuItem> )}
                        <Divider />
                        <MenuItem onClick={handleLogout}><LogoutIcon sx={{mr: 1}} fontSize="small"/> Cerrar Sesión</MenuItem>
                    </Menu>
                </>
            ) : (
                 <Button
                    variant="contained"
                    color="secondary"                    
                    startIcon={<GoogleIcon />}
                    onClick={() => googleLogin()}
                    sx={{
                        // Asegurar buen contraste de texto sobre fondo amarillo/ámbar
                        color: 'primary.dark', // O 'common.black' o un gris oscuro
                        fontWeight: 'bold', // Mantener negrita si quieres
                        fontSize: '0.8rem', // Tamaño ajustado
                        py: 0.8, // Padding vertical ajustado
                        // El color de hover vendrá del tema para 'containedSecondary' si lo definiste
                        // Si no, puedes añadirlo aquí:
                        // '&:hover': { bgcolor: amber[700] } // Ejemplo de hover más oscuro
                    }}
                 >
                     Iniciar Sesión
                 </Button>
            )}
        </Box>
    );
};

export default NavbarActions;