import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar, Tooltip, Container, Divider,InputBase, alpha
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // Icono para menú desplegable
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MenuIcon from '@mui/icons-material/Menu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import logoConaljuve from '../../assets/LogoCONALJUVE.png'; // Ajusta la extensión (.png, .jpg, .svg)
import SearchIcon from '@mui/icons-material/Search'; // Icono de búsqueda
import FacebookIcon from '@mui/icons-material/Facebook';
import EditIcon from '@mui/icons-material/Edit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber'; // Icono para advertencia
import api from '../../services/api'; // <-- Añadir esta línea (asegúrate que la ruta sea correcta)
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google'; // Icono de Google



const pages = [ // Elementos principales del menú
  { name: 'Inicio', path: '/' },
  { name: '¿Qué es CONALJUVE?', path: '/sobre-conaljuve' },
  // { name: 'Noticias por Depto.', path: '/noticias' }, // Puedes añadir más
];
const committeePages = [
  { name: 'Comité de Juventud', path: '/comites/juventud' },
  { name: 'Comité de Profesionales', path: '/comites/profesionales' },
  { name: 'Comité de Mujeres', path: '/comites/mujeres' },
  { name: 'Comité de Salud', path: '/comites/salud' },
  { name: 'Aliados Estratégicos', path: '/comites/aliados' }, // O '/aliados-estrategicos' si prefieres ruta separada
];
//const Navbar = ({ onLoginClick, onRegisterClick }) => {
const Navbar = ({ onOpenProfileModal  /*, onLoginClick, onRegisterClick */ }) => {
  const { isAuthenticated, refetchUser, user, isAdmin, isStaff, logout } = useAuth();
   // URL del endpoint de inicio de Facebook en el backend
  const facebookLoginUrl = `${import.meta.env.VITE_API_URL || '/api'}/auth/facebook`;
  console.log('⬇️ Navbar - isAuthenticated:', isAuthenticated, 'User:', user); // <-- DEBUG
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElCommittees, setAnchorElCommittees] = useState(null);
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleFacebookLogin = () => {
    const popup = window.open(facebookLoginUrl, 'facebook-login', 'width=600,height=700,scrollbars=yes');

    const handleAuthMessage = (event) => {
        // Verificar origen por seguridad
        // Origen esperado podría ser la URL base del frontend o la del backend si el script se sirve desde ahí
        // Ajusta esta verificación según sea necesario. Por ahora, aceptaremos del mismo origen.
        // const expectedOrigin = process.env.NODE_ENV === 'production' ? 'TU_DOMINIO_FRONTEND' : window.location.origin;
        // if (event.origin !== expectedOrigin) { return; }

        if (event.data?.type === 'auth-success' && event.data?.payload) {
            const { user: loggedInUser, token } = event.data.payload;
            console.log("Auth Success Mensaje Recibido:", { loggedInUser, token });

            // 1. Guardar Token
            localStorage.setItem('authToken', token);
            // 2. Actualizar Header Axios (ya debería hacerlo el interceptor, pero por si acaso)
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // 3. Actualizar AuthContext: La forma más limpia es llamar a refetchUser
            //    para que AuthContext vuelva a pedir /me con el nuevo token/sesión.
            refetchUser(); // <-- Llama a la función del contexto para actualizar el estado

            // 4. Limpiar listener
            window.removeEventListener('message', handleAuthMessage);

        } else if (event.data?.type === 'auth-error') {
            console.error("Auth Error Mensaje Recibido:", event.data.error);
            // Mostrar mensaje de error al usuario (puedes usar un estado o un toast)
            alert(`Error de inicio de sesión con Facebook: ${event.data.error || 'desconocido'}`);
             window.removeEventListener('message', handleAuthMessage);
        }
    };

    // Escuchar mensajes del popup
    window.addEventListener('message', handleAuthMessage, false);

    // Opcional: Verificar si el popup se cerró sin enviar mensaje
    const checkPopupClosed = setInterval(() => {
        if (popup && popup.closed) {
            clearInterval(checkPopupClosed);
            window.removeEventListener('message', handleAuthMessage); // Asegurar limpieza
            console.log("Popup cerrado por el usuario o después de mensaje.");
        }
    }, 500); // Revisar cada medio segundo
  };
  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/'); // Redirigir a inicio después de logout
  };
 // Handler general para navegar y cerrar TODOS los menús
  const handleNavigate = (path) => {
    handleCloseNavMenu();
    handleCloseUserMenu();
    handleCloseCommitteesMenu(); // Cerrar menú comités también
    navigate(path);
  };
  // --- HANDLERS MENÚ COMITÉS ---
  const handleOpenCommitteesMenu = (event) => {
    setAnchorElCommittees(event.currentTarget);
};
const handleCloseCommitteesMenu = () => {
    setAnchorElCommittees(null);
};
const handleOpenCreateNewsModal = () => {
  handleCloseUserMenu(); // Cerrar menú de usuario
  // Lógica para abrir el modal:
  // Opción 1: Si el modal se controla en un nivel superior (ej. MainLayout o AdminPage)
  if (onOpenProfileModal ) { // Verifica si la prop existe
    onOpenProfileModal(); // Llama a la función pasada como prop
  } else {
      // Opción 2: Navegar a una ruta específica que abra el modal (menos directo)
      // navigate('/admin?openModal=true'); // Requeriría lógica en AdminPage para leer query param
      console.warn("Función para abrir modal de noticias no proporcionada a Navbar");
  }
};
// Handler para abrir el modal desde el menú (llama a la prop)
const handleOpenProfileModalClick = () => {
  handleCloseUserMenu(); // Cerrar menú actual
  if (onOpenProfileModal) {
      onOpenProfileModal(); // Llamar a la función pasada desde MainLayout
  } else {
      console.warn("Navbar: onOpenProfileModal no fue proporcionado.");
  }
};
// --- Lógica Google Login ---
const handleGoogleLogin = () => {
  const popup = window.open(/*...*/);
  let intervalId = null; // Para guardar ID del intervalo

  const handleAuthMessage = async (event) => {
      // ... (verificar origen) ...
      if (event.data?.type === 'auth-success' && event.data?.payload) {
          // ... (guardar token, refetchUser) ...
          // --- CERRAR POPUP DESDE AQUÍ ---
          if (popup && !popup.closed) {
              popup.close();
          }
          // --- FIN CERRAR ---
          window.removeEventListener('message', handleAuthMessage);
          if (intervalId) clearInterval(intervalId); // Limpiar intervalo
      } else if (event.data?.type === 'auth-error') {
          // ... (manejar error) ...
           if (popup && !popup.closed) popup.close(); // Cerrar también en error
           window.removeEventListener('message', handleAuthMessage);
           if (intervalId) clearInterval(intervalId);
      }
  };
  window.addEventListener('message', handleAuthMessage);

  // Quitar el intervalo que solo chequeaba si estaba cerrado
  // intervalId = setInterval(() => { ... });
};
const handleGoogleLoginSuccess = async (googleResponse) => {
  console.log('Google Login Success:', googleResponse);
  // googleResponse contiene 'code' para flujo de autorización
  // o 'access_token'/'id_token' para flujo implícito.
  // Para mayor seguridad, usaremos el flujo de autorización (code)
  // si está configurado, o verificaremos el access_token/id_token en el backend.

  // --- ENFOQUE: Enviar 'code' al backend para obtener token propio ---
  // Este es el flujo más seguro recomendado por Google
  if (googleResponse.code) {
       console.log("Enviando código de autorización de Google al backend...");
       try {
           // NECESITAS UN NUEVO ENDPOINT EN EL BACKEND: POST /api/auth/google/verify-code
           const { data } = await api.post('/auth/google/verify-code', { code: googleResponse.code });

           console.log("Respuesta del backend (verify-code):", data);
           if (data.token && data.user) {
               localStorage.setItem('authToken', data.token);
               api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
               await refetchUser(); // Recargar datos con el nuevo token/sesión establecida
           } else {
                console.error("El backend no devolvió token/usuario después de verificar código.");
                alert("Error al procesar inicio de sesión con Google (BE).");
           }
       } catch (error) {
            console.error("Error enviando código de Google al backend:", error.response?.data || error);
            alert(`Error al iniciar sesión con Google: ${error.response?.data?.message || 'Error de servidor'}`);
       }

  } else {
      console.warn("Flujo de código de Google no detectado, revisa la configuración de useGoogleLogin.");
       alert("Error inesperado durante el inicio de sesión con Google.");
  }
};

const handleGoogleLoginError = (error) => {
  console.error('Google Login Failed:', error);
  alert('Inicio de sesión con Google falló.');
};

const googleLogin = useGoogleLogin({
  // --- Usar Flujo de Código (Authorization Code Flow) ---
  flow: 'auth-code', // Más seguro que 'implicit'
  onSuccess: handleGoogleLoginSuccess,
  onError: handleGoogleLoginError,
  // ux_mode: 'popup', // Puedes forzar popup si prefieres sobre redirect
});
// --- Fin Lógica Google Login ---
// --- FIN HANDLERS ---
  // Determinar las iniciales como fallback
  const getInitials = (name) => {
    if (!name) return '?';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
}
const userInitials = getInitials(user?.name)
 // --- Estilo para los links del menú (simulando WWF) ---
  const menuLinkStyle = {
      my: 2,
      color: 'white',
      display: 'block',
      mx: 1.5, // Más espaciado
      fontWeight: 700, // Grueso
      fontSize: '0.9rem', // Ligeramente más pequeño
      textTransform: 'uppercase', // MAYÚSCULAS
      letterSpacing: '0.05em',
      textDecoration: 'none',
      '&:hover': {
          color: 'secondary.main', // Color de acento al pasar el mouse
      }
  };

  const navbarHeight = 64; // Altura real de tu AppBar
  const logoHeight = 80;   // Altura total del logo
return (
     // --- MODIFICACIÓN: Añadir estilos de fondo al AppBar ---
     <AppBar
     position="fixed"
     elevation={3} // Puedes añadir algo de sombra si quieres
     sx={{
         backgroundColor: '#222', // Fondo oscuro base
        // backgroundImage: `url(${bannerConaljuve})`, // Establecer la imagen de fondo
        // backgroundSize: 'cover',                   // Escalar la imagen para cubrir el área
        // backgroundPosition: 'center center',       // Centrar la imagen
        // backgroundRepeat: 'no-repeat',             // Evitar que se repita
         // Opcional: Añadir un overlay semitransparente para mejorar legibilidad del texto
        //  '&::before': { // Pseudo-elemento para el overlay
        //      content: '""',
        //      position: 'absolute',
        //      top: 0,
        //      left: 0,
        //      right: 0,
        //      bottom: 0,
        //      backgroundColor: 'rgba(0, 30, 60, 0.3)', // Azul oscuro semitransparente (ajusta color y opacidad)
        //      zIndex: 0, // Detrás del contenido
        //  },
         // Asegurarse que el contenido esté por encima del overlay
         backgroundImage: `url('/assets/patterns/pattern.png')`,  // Si usas imagen
          backgroundRepeat: 'repeat',
          height: `${navbarHeight}px`,
          //background: 'linear-gradient(rgba(30,30,30,0.95), rgba(50,50,50,0.98)), url("data:image/svg+xml,%3Csvg width=\'6\' height=\'6\' viewBox=\'0 0 6 6\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23555555\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M5 0h1L0 6V5zM6 5v1H5z\'/%3E%3C/g%3E%3C/svg%3E")', // Ejemplo pattern CSS
          color: '#ffffff', // Cambiar color de texto a blanco para contraste
          '& .MuiToolbar-root, & .MuiContainer-root': { // Aplicar a Toolbar y Container dentro del AppBar
              position: 'relative', // Para que el z-index funcione
              zIndex: 1,
          },
          // Cambiar color de botones/iconos si es necesario
          '& .MuiButton-root': { color: '#ffffff' },
          '& .MuiIconButton-root': { color: '#ffffff' },
     }}
 >
 
      <Container maxWidth="lg" sx={{ height: '100%' }}> {/* Controla el ancho máximo */}
        <Toolbar disableGutters sx={{ height: '100%', position: 'relative', minHeight: {xs: 56, md: 70} }}> {/* Altura mínima y posición relativa */}

          {/* --- Logo --- */}
          {/* <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', marginRight: '16px' }}> */}
        <Box
            component={RouterLink}
            to="/"
            sx={{
              height: `${navbarHeight + (logoHeight - navbarHeight) / 2}px`,
              position: { xs:'relative', md: 'absolute' }, // Relativo en móvil, absoluto en desktop
              left: { xs: 0, md: '-10px' }, // Desplazado a la izquierda en desktop
              top: { xs: 0, md: '-15px' }, // Desplazado hacia arriba en desktop
              zIndex: 1301, // Encima del AppBar y otros elementos
              
              p: { xs: 0.5, md: 1 }, // Padding alrededor del logo
              borderRadius: '4px', // Bordes redondeados
              boxShadow: '0px 4px 8px rgba(0,0,0,0.2)', // Sombra para destacar
              display: 'inline-block', // Para que el padding funcione bien
              lineHeight: 0, // Evitar espacio extra
              transform: {xs: 'none', md: 'translateY(10px)'} // Ajuste vertical fino si es necesario
            }}
            // alt="Logo CONALJUVE"
            // src={logoConaljuve} // Usar el logo importado
        >
          <img
            
            src={logoConaljuve}
            alt="Logo CONALJUVE"
            style={{
                height: '100px', // Tamaño del logo (ajusta)
                display: 'block',
            }}
        />
        </Box>
                        

          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              ml: 16,
              display: { xs: 'none', md: 'flex' }, // Oculto en móvil, visible en desktop
              fontWeight: 700,
              // letterSpacing: '.1rem',
              color: '#ffffff', // Usar color primario del tema
              textDecoration: 'none',
              alignItems: 'center'
            }}
          >
             
             {/* <Box component="span" sx={{mr: 1, fontSize: '1.8rem'}}>🇧🇴</Box> Emoji temporal */}
             CONALJUVE
          </Typography>
          {/* </RouterLink> */}
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
              // sx={{ display: { xs: 'block', md: 'none' } }}
              sx={{ ...menuLinkStyle, py: 1 }} 
            >
               {/* Pages Principales */}
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={() => handleNavigate(page.path)}>
                  <Typography  textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
              {/* Separador y Comités */}
              <Divider />
              <MenuItem onClick={handleOpenCommitteesMenu} sx={{ justifyContent: "space-between", minHeight: 'auto', }}>
                  Comités<KeyboardArrowDownIcon fontSize='small'/>
              </MenuItem>
              {committeePages.map((page) => (
                                <MenuItem key={page.name} onClick={() => handleNavigate(page.path)} sx={{ pl: 4 }}> {/* Indentación */}
                                    <Typography textAlign="center">{page.name}</Typography>
                                </MenuItem>
                            ))}
              <Divider />
              {/* Añadir Admin en móvil si es admin */}
              {(isAdmin || isStaff) && ( // Mostrar si es Admin O Staff
                             <MenuItem onClick={() => handleNavigate('/admin')}>
                                 <AdminPanelSettingsIcon sx={{ mr: 1 }} /> Administración
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
            {/* Botón Comités con Menú Desplegable */}
            <Button
                            onClick={handleOpenCommitteesMenu}
                            // sx={{ my: 2, color: 'white', display: 'block', mx: 1.5, fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.9rem' }}
                            sx={{ ...menuLinkStyle, py: 1 }} // <-- Aplicar estilo y ajustar padding
                            endIcon={<KeyboardArrowDownIcon />} // Icono flecha abajo
                            aria-controls={anchorElCommittees ? 'committees-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={anchorElCommittees ? 'true' : undefined}
                        >
                            Comités
                        </Button>
                        <Menu
                            id="committees-menu"
                            anchorEl={anchorElCommittees}
                            open={Boolean(anchorElCommittees)}
                            onClose={handleCloseCommitteesMenu}
                            MenuListProps={{ 'aria-labelledby': 'committees-button' }}
                            // Posicionamiento del menú
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        >
                            {committeePages.map((page) => (
                                <MenuItem key={page.name} onClick={() => handleNavigate(page.path)}>
                                    {page.name}
                                </MenuItem>
                            ))}
                        </Menu>
          </Box>

          {/* --- Botones de Autenticación / Menú de Usuario --- */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated && user? (
              <>
                <Tooltip title="Abrir menú">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {/* Usar iniciales o imagen de perfil si la hubiera */}
                    <Avatar
                    alt={user.name || user.username} // Texto alternativo para accesibilidad
                    src={user.profilePictureUrl || undefined} // Pasar la URL de la foto aquí
                    sx={{
                        bgcolor: user.profilePictureUrl ? 'transparent' : 'secondary.main', // Color de fondo solo si NO hay imagen
                        width: 32, height: 32, fontSize: '0.8rem'
                    }}
                    >
                    {/* Fallback a Iniciales si no hay foto */}
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
                  <MenuItem disabled sx={{ '&.Mui-disabled': { opacity: 1, color: 'text.primary', fontWeight: 500 } }}>
                    <Typography variant="body2">Hola, {user?.name || user?.username}</Typography>
                  </MenuItem>
                  <Divider />
                   {/* --- MENU ITEMS CONDICIONALES --- */}

                    {/* Opción Completar Perfil (si está incompleto) */}
                    {!user.isProfileComplete && (
                        <MenuItem onClick={handleOpenProfileModalClick}>
                            <WarningAmberIcon sx={{ mr: 1, color: 'warning.main' }} fontSize="small"/> Completar Perfil
                        </MenuItem>
                    )}

                     {/* Opción Editar Perfil (si está completo) */}
                     {user.isProfileComplete && (
                        <MenuItem onClick={handleOpenProfileModalClick}>
                             <EditIcon sx={{ mr: 1 }} fontSize="small"/> Editar Perfil
                         </MenuItem>
                     )}
                  {/* <MenuItem onClick={() => handleNavigate('/perfil')}>Perfil</MenuItem> */}
                  {(isAdmin || isStaff) && (
                    <>
                      <MenuItem onClick={handleOpenCreateNewsModal}> {/* <-- Llamar handler modal */}
                      <AddCircleOutlineIcon sx={{ mr: 1, fontSize: '1.2rem' }} /> Crear Noticia
                      </MenuItem>
                      <MenuItem onClick={() => handleNavigate('/admin')}>
                      <AdminPanelSettingsIcon sx={{ mr: 1, fontSize: '1.2rem' }}/> Administración
                      </MenuItem>
                    </>
                  )}
                  <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
                </Menu>
              </>
            ) : (
              // <Box>
              //   <Button variant="outlined" color="primary" sx={{ mr: 1 }} onClick={onLoginClick}>
              //     Iniciar Sesión
              //   </Button>
              //   <Button variant="contained" color="secondary" onClick={onRegisterClick}>
              //     Registrarse
              //   </Button>
              // </Box>
            //   // --- BOTÓN FACEBOOK LOGIN ---
            //   <Button
            //     variant="contained"
            //     color="primary" // O un color azul de Facebook
            //     startIcon={<FacebookIcon />}
            //     onClick={handleFacebookLogin} // <-- LLAMAR AL HANDLER DEL POPUP
            //     //href={facebookLoginUrl} // Enlace directo al backend
            //     // Quitar rel="noopener noreferrer" si es del mismo origen base
            //     // (aunque no hace daño)
            //     sx={{
            //         // Estilos opcionales para el botón de FB
            //         // backgroundColor: '#1877F2',
            //         // '&:hover': { backgroundColor: '#166FE5' }
            //     }}
            //   >
            //     Acceder con Facebook
            //  </Button>
          // --- BOTÓN GOOGLE LOGIN ---
          <Button
              variant="contained"
              color="primary" // Puedes darle estilo específico
              sx={{ bgcolor: 'blue', color: '#444', '&:hover': { bgcolor: 'black'} }} // Estilo Google
              startIcon={<GoogleIcon />}
              onClick={() => googleLogin()} // Llamar al hook para iniciar flujo
          >
          Acceder con Google
          </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;