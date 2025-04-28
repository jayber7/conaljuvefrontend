// src/components/Layout/Sidebar.jsx
import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Paper, Tooltip } from '@mui/material';
import { NavLink as RouterNavLink } from 'react-router-dom'; // Usar NavLink para estilo activo
// Importar iconos principales
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MapIcon from '@mui/icons-material/Map';
import GroupsIcon from '@mui/icons-material/Groups';
// ... otros iconos si son necesarios ...

// Definir items de la barra lateral
const sidebarNavItems = [
    { id: 'inicio', name: 'Inicio', path: '/', icon: <HomeIcon /> },
    { id: 'institucion', name: 'Institución', path: '/sobre-conaljuve', icon: <AccountBalanceIcon /> }, // Enlaza a la página principal de info
    { id: 'federaciones', name: 'Federaciones', path: '/federaciones', icon: <MapIcon /> }, // Ruta base para federaciones
    { id: 'comites', name: 'Comités', path: '/comites', icon: <GroupsIcon /> }, // Ruta base para comités
];

// Estilo para los botones de la barra lateral (inspirado en categorías)
const sidebarButtonStyle = (theme) => ({ // Hacerlo función para acceder al tema
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '90px', // Ancho fijo (ajustar)
    height: '90px', // Alto fijo (ajustar)
    borderRadius: '12px', // Más redondeado
    mb: 1.5, // Margen inferior
    color: theme.palette.text.secondary, // Color icono/texto inactivo
    backgroundColor: theme.palette.background.paper, // Fondo base
    border: `1px solid ${theme.palette.divider}`,
    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out',
    '& .MuiListItemIcon-root': { // Estilo icono
        minWidth: 'auto',
        color: 'inherit', // Heredar color
        fontSize: '2rem', // Tamaño icono
        mb: 0.5, // Espacio bajo icono
    },
    '& .MuiListItemText-root .MuiTypography-root': { // Estilo texto
         fontSize: '0.7rem', // Tamaño texto
         fontWeight: 500,
         lineHeight: 1.2,
    },
    // Estilo cuando el enlace está ACTIVO (usando NavLink)
    '&.active': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.action.selected, // Un fondo sutil activo
      borderColor: theme.palette.primary.light,
      fontWeight: 'bold',
      '& .MuiListItemIcon-root': {
          color: theme.palette.primary.main, // Icono color primario
       },
        '& .MuiListItemText-root .MuiTypography-root': { // Estilo texto
             fontWeight: 600,
        },
    },
    // Hover general
     '&:hover': {
        backgroundColor: theme.palette.action.hover,
        color: theme.palette.primary.main,
     }
});


// Ancho de la barra lateral
export const drawerWidth = 120; // Ajustar este valor

const Sidebar = () => {
    return (
        <Paper
            elevation={2}
            sx={{
                width: drawerWidth,
                flexShrink: 0, // Evitar que se encoja
                height: '100vh', // Ocupar toda la altura
                position: 'fixed', // Fijar a la izquierda
                top: 0,
                left: 0,
                zIndex: (theme) => theme.zIndex.appBar - 1, // Debajo del AppBar superior
                overflowY: 'auto', // Permitir scroll si hay muchos items
                pt: (theme) => `${theme.mixins.toolbar.minHeight}px`, // Padding top para dejar espacio al AppBar superior
                borderRight: (theme) => `1px solid ${theme.palette.divider}`
            }}
        >
            <List sx={{ p: 1 }}> {/* Padding interno */}
                {sidebarNavItems.map((item) => (
                    <ListItem key={item.id} disablePadding sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Tooltip title={item.name} placement="right">
                        {/* Usar NavLink para obtener clase 'active' */}
                        <ListItemButton
                            component={RouterNavLink}
                            to={item.path}
                            // El estilo 'active' se aplicará automáticamente por NavLink
                            sx={(theme) => sidebarButtonStyle(theme)}
                            end // Para que NavLink considere ruta exacta para 'active' (opcional)
                        >
                            <ListItemIcon sx={{justifyContent: 'center'}}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                        </Tooltip>
                    </ListItem>
                ))}
                 {/* Puedes añadir Dividers o más secciones si es necesario */}
            </List>
        </Paper>
    );
};

export default Sidebar;