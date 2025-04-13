import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Tooltip, Container, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
// import logo from '../../assets/logo-conaljuve.png'; // Asegúrate de tener tu logo

const pages = [ // Elementos principales del menú
  { name: 'Inicio', path: '/' },
  { name: '¿Qué es CONALJUVE?', path: '/sobre-conaljuve' },
  // { name: 'Noticias por Depto.', path: '/noticias' }, // Puedes añadir más
];

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/'); // Redirigir a inicio después de logout
  };

  const handleNavigate = (path) => {
    handleCloseNavMenu();
    handleCloseUserMenu();
    navigate(path);
  }

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ bgcolor: 'background.paper'}}>
      <Container maxWidth="lg"> {/* Controla el ancho máximo */}
        <Toolbar disableGutters> {/* Sin padding por defecto */}

          {/* --- Logo --- */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' }, // Oculto en móvil, visible en desktop
              fontWeight: 700,
              // letterSpacing: '.1rem',
              color: 'primary.main', // Usar color primario del tema
              textDecoration: 'none',
              alignItems: 'center'
            }}
          >
             {/* <img src={logo} alt="CONALJUVE Logo" style={{ height: '30px', marginRight: '10px' }} /> */}
             <Box component="span" sx={{mr: 1, fontSize: '1.8rem'}}>🇧🇴</Box> {/* Emoji temporal */}
             CONALJUVE
          </Typography>

          {/* --- Menú Móvil --- */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar-nav"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar-nav"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={() => handleNavigate(page.path)}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
              {/* Añadir Admin en móvil si es admin */}
               {isAdmin && (
                 <MenuItem onClick={() => handleNavigate('/admin')}>
                   <AdminPanelSettingsIcon sx={{ mr: 1 }} /> Admin
                 </MenuItem>
               )}
            </Menu>
          </Box>

          {/* --- Logo Móvil (Centrado o a la izquierda) --- */}
           <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1, // Para centrar si no hay más elementos
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
               alignItems: 'center'
            }}
          >
             <Box component="span" sx={{mr: 1, fontSize: '1.5rem'}}>🇧🇴</Box> CONALJUVE
          </Typography>

          {/* --- Menú Desktop --- */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleNavigate(page.path)}
                sx={{ my: 2, color: 'text.primary', display: 'block', mx: 1 }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* --- Botones de Autenticación / Menú de Usuario --- */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Abrir menú">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {/* Usar iniciales o imagen de perfil si la hubiera */}
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32, fontSize: '0.8rem' }}>
                      {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
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
                  <MenuItem disabled sx={{ '&.Mui-disabled': { opacity: 1, color: 'text.primary', fontWeight: 500 } }}>
                    <Typography variant="body2">Hola, {user?.name || user?.username}</Typography>
                  </MenuItem>
                  <Divider />
                  {/* <MenuItem onClick={() => handleNavigate('/perfil')}>Perfil</MenuItem> */}
                   {isAdmin && (
                      <MenuItem onClick={() => handleNavigate('/admin')}>
                          <AdminPanelSettingsIcon sx={{ mr: 1, fontSize: '1.2rem' }}/> Administración
                      </MenuItem>
                   )}
                  <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                </Menu>
              </>
            ) : (
              <Box>
                <Button variant="outlined" color="primary" sx={{ mr: 1 }} onClick={onLoginClick}>
                  Iniciar Sesión
                </Button>
                <Button variant="contained" color="secondary" onClick={onRegisterClick}>
                  Registrarse
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;