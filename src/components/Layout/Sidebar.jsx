// src/components/Layout/Sidebar.jsx
import React, { useState, useRef } from 'react'; // Necesitamos useState
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Paper, Tooltip, Menu, MenuItem, Popover, MenuList } from '@mui/material'; // Importar Menu, MenuItem
import { NavLink as RouterNavLink, useLocation, useNavigate } from 'react-router-dom';
// ... (imports iconos) ...
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HowToRegIcon from '@mui/icons-material/HowToReg'; // O PersonAddIcon
import MapIcon from '@mui/icons-material/Map';
import LocationCityIcon from '@mui/icons-material/LocationCity'; // Para Municipales
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact'; // Para Coordinadoras
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment'; // Icono para Proyectos
import GavelIcon from '@mui/icons-material/Gavel'; // Icono para Tribunal
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';

import { colors } from '@mui/material';

// --- NUEVO TAMAÑO Y ESTILO ---
const sidebarButtonSize = 56; // Tamaño más pequeño (ej. 75px)
// --- DEFINIR ITEMS CON COLORES ---
// Usaremos colores de MUI o hexadecimales
const sidebarNavItems = [
    { id: 'inicio', name: 'Inicio', path: '/', icon: <HomeIcon />, bgColor: colors.blue[600], textColor: '#fff' },
    {
      id: 'institucion', name: 'Institución', icon: <AccountBalanceIcon />, bgColor: colors.deepOrange[500], textColor: '#fff',
      subItems: [
        { name: '¿Qué es CONALJUVE?', path: '/sobre-conaljuve' }, // Mover aquí
        { name: 'COMITÉ EJECUTIVO NACIONAL (C.E.N.)', path: '/institucion/organigrama' },
        { name: 'Estatuto Orgánico', path: '/institucion/estatuto' },
        // { name: 'Estructura CONALJUVE', path: '/institucion/estructura' }, // Combinado o separado?
        { name: 'Visión y Misión', path: '/institucion/vision-mision' },
        { name: 'Objeto y Fines', path: '/institucion/objeto-fines' },
        { name: 'Tribunal de honor y disiplinario', path: '/institucion/tribunal' },
      ]
    },
    { id: 'registro', name: 'Registro', path: '/registro-miembro', icon: <HowToRegIcon />, bgColor: colors.teal[500], textColor: '#fff' }, // Enlace directo (o abre modal?)
    {
      id: 'federaciones_dptales', name: 'Federaciones Departamentales', icon: <SouthAmericaIcon />, bgColor: colors.green[600], textColor: '#fff', // Nombre corto
      subItems: [
        { name: 'Chuquisaca', path: '/federaciones/dptales/ch' },
        { name: 'La Paz', path: '/federaciones/dptales/lp' },
        { name: 'Cochabamba', path: '/federaciones/dptales/cb' },
        { name: 'Oruro', path: '/federaciones/dptales/or' },
        { name: 'Potosí', path: '/federaciones/dptales/pt' },
        { name: 'Tarija', path: '/federaciones/dptales/tj' },
        { name: 'Santa Cruz', path: '/federaciones/dptales/sc' },
        { name: 'Beni', path: '/federaciones/dptales/be' },
        { name: 'Pando', path: '/federaciones/dptales/pa' },
       
      ]
    },
    {
      id: 'federaciones_muni', name: 'Federaciones Municipales', icon: <LocationCityIcon />, bgColor: colors.cyan[600], textColor: '#fff', // Nombre corto
      subItems: [
        { name: 'Chuquisaca', path: '/federaciones/muni/ch' },
        { name: 'La Paz', path: '/federaciones/muni/lp' },
        { name: 'Cochabamba', path: '/federaciones/muni/cb' }, 
        { name: 'Oruro', path: '/federaciones/muni/or' },
        { name: 'Potosí', path: '/federaciones/muni/pt' },
        { name: 'Tarija', path: '/federaciones/muni/tj' },
        { name: 'Santa Cruz', path: '/federaciones/muni/sc' },
        { name: 'Beni', path: '/federaciones/muni/be' },
        { name: 'Pando', path: '/federaciones/muni/pa' },
       
        
      ]
    },
      {
      id: 'coordinadoras', name: 'Coordinadoras', icon: <ConnectWithoutContactIcon />, bgColor: colors.indigo[500], textColor: '#fff', // Nombre corto
      subItems: [
        { name: 'Chuquisaca', path: '/coordinadoras/ch' },
        { name: 'La Paz', path: '/coordinadoras/lp' },
        { name: 'Cochabamba', path: '/coordinadoras/cb' },
        { name: 'Oruro', path: '/coordinadoras/or' },
        { name: 'Potosí', path: '/coordinadoras/pt' },
        { name: 'Tarija', path: '/coordinadoras/tj' },
        { name: 'Santa Cruz', path: '/coordinadoras/sc' },
        { name: 'Beni', path: '/coordinadoras/be' },
        { name: 'Pando', path: '/coordinadoras/pd' },
        
      ]
    },
    {
      id: 'comites', name: 'Comités', icon: <GroupsIcon />, bgColor: colors.purple[500], textColor: '#fff',
      subItems: [
        { name: 'Comité de Juventud', path: '/comites/juventud' },
        { name: 'Comité de Profesionales', path: '/comites/profesionales' },
        { name: 'Comité de Mujeres', path: '/comites/mujeres' },
        { name: 'Comité de Salud', path: '/comites/salud' },
        { name: 'Aliados Estratégicos', path: '/comites/aliados' },
      ]
    },
    { id: 'proyectos', name: 'Proyectos', path: '/proyectos', icon: <AssignmentIcon />, bgColor: colors.lime[600], textColor: '#fff' },
    { id: 'tribunales', name: 'Tribunales', path: '/tribunales', icon: <GavelIcon />, bgColor: colors.brown[500], textColor: '#fff' }, // Nuevo item
  ];
// --- FIN DEFINIR ITEMS ---

// --- ESTILO DINÁMICO DEL BOTÓN ---
// Ahora acepta el item completo para acceder a sus colores
const sidebarButtonStyle = (theme, item, isActive) => {
    const baseBgColor = item.bgColor || theme.palette.background.paper; // Color base del item o default
    const baseTextColor = item.textColor || theme.palette.text.secondary; // Color texto/icono base
    const activeBgColor = theme.palette.action.selected; // Fondo para estado activo (claro)
    const activeColor = theme.palette.primary.main; // Color texto/icono activo
    const hoverBgColor = theme.palette.action.hover; // Fondo hover general    
    const hoverColor = baseBgColor; // <-- Usar el color de fondo base para el hover del icono/texto

    
    return {
        display: 'flex',
        //flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        //textAlign: 'center',
        width: `${sidebarButtonSize}px`, // Usar variable
        height: `${sidebarButtonSize}px`, // Usar variable
        borderRadius: '10px', // Ajustar redondez
        mb: 1.5, // Menos margen inferior
        p: 0, // Padding interno
        // --- ESTADO BASE (INACTIVO) ---
        // Aplicar colores base
        color: isActive ? activeColor : baseTextColor, // Color basado en activo
        backgroundColor: isActive ? activeBgColor : baseBgColor, // Color fondo
        border: isActive ? `2px solid ${theme.palette.primary.light}`: '1px solid transparent', // Borde solo si activo (o borde suave siempre)
        transition: theme.transitions.create(['background-color', 'color', 'transform', 'border-color'], {
            duration: theme.transitions.duration.short,
        }),
        // --- ESTILOS DEL ICONO ---
        '& .MuiListItemIcon-root': {
            minWidth: 'auto', 
            fontSize: `${sidebarButtonSize * 0.6}px`, // Ejemplo: 60% del tamaño del botón (ajusta este factor)
            mb: 0.25, // Menos espacio icono-texto
            color: 'inherit', 
            transition: 'inherit',
            margin: 0,
            padding: 0,
            display: 'flex', // Asegurar centrado del icono SVG interno
            alignItems: 'center',
            justifyContent: 'center',
        },
        
        '& .MuiListItemText-root .MuiTypography-root': {
             fontSize: '0.65rem', // Texto más pequeño
             fontWeight: isActive ? 600 : 500, // Negrita si activo
             lineHeight: 1.1,
             color: 'inherit',
        },
        
        // Estilo HOVER (sobrescribir el color base)
         '&:hover': {
            backgroundColor: hoverBgColor, // Fondo hover general claro
            color:  hoverColor, // Color hover general primario
            transform: 'scale(1.05)', // Efecto sutil de escala
            border: isActive ? `2px solid ${theme.palette.primary.light}` : '1px solid transparent',

            // Opcional: Hacer el hover más intenso usando el color del botón
            // backgroundColor: alpha(baseBgColor, 0.8), // Aclarar ligeramente el color base
            // color: baseTextColor, // Mantener texto blanco/original
         }
    };
};
// --- FIN ESTILO ---

export const drawerWidth = 75; // Reducir ancho barra lateral AÚN MÁS (ej. 75px) - Experimenta

const Sidebar = ({ topOffset = 0 }) => {
    const [openMenuId, setOpenMenuId] = useState(null); // Guarda el ID del menú abierto
    const [anchorEl, setAnchorEl] = useState(null); // Elemento al que se ancla el Popover
    const navigate = useNavigate(); // Hook para navegar
    const location = useLocation();

    // Refs para mantener timeouts y evitar cierres accidentales
    const leaveTimeoutRef = useRef(null);
    const enterTimeoutRef = useRef(null);

    // Abrir Popover al entrar al botón (con pequeño delay opcional)
    const handleMouseEnter = (event, menuId) => {
        clearTimeout(leaveTimeoutRef.current); // Cancela cualquier cierre pendiente
        // Opcional: Delay antes de abrir
        // enterTimeoutRef.current = setTimeout(() => {
            setAnchorEl(event.currentTarget);
            setOpenMenuId(menuId);
        // }, 100); // Delay de 100ms
    };

    // Iniciar cierre al salir del botón o del Popover (con delay)
    const handleMouseLeave = () => {
        clearTimeout(enterTimeoutRef.current); // Cancela apertura pendiente
        // Delay antes de cerrar para permitir mover el ratón hacia el Popover
        leaveTimeoutRef.current = setTimeout(() => {
            setAnchorEl(null);
            setOpenMenuId(null);
        }, 200); // Delay de 200ms (ajusta según necesidad)
    };

    // Mantener abierto si el ratón entra al Popover
    const handlePopoverEnter = () => {
        clearTimeout(leaveTimeoutRef.current); // Cancela el cierre pendiente
    };

    // Navegar y cerrar
    const handleNavigateAndClose = (path) => {
         clearTimeout(leaveTimeoutRef.current);
         clearTimeout(enterTimeoutRef.current);
         setAnchorEl(null);
         setOpenMenuId(null);
         navigate(path);
    };

    // Estado para manejar qué menú está abierto y su ancla
    const [anchorElMenu, setAnchorElMenu] = useState({}); // { institucion: anchorElement, federaciones_dptales: anchorEl, ... }
    
    // Abrir menú específico
    const handleMenuOpen = (event, menuId) => {
        setAnchorElMenu(prev => ({ ...prev, [menuId]: event.currentTarget }));
    };

    // Cerrar menú específico
    const handleMenuClose = (menuId) => {
         setAnchorElMenu(prev => ({ ...prev, [menuId]: null }));
    };

    // Cerrar TODOS los menús
    const handleCloseAllMenus = () => {
        setAnchorElMenu({});
    };
    return (
        <Paper 
        elevation={2}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                height: '100vh',
                position: 'fixed',
                top: 0, // Empieza arriba
                left: 0,
                backgroundImage: `url('/assets/patterns/pattern.png')`,
                zIndex: (theme) => theme.zIndex.drawer, // Z-index normal de drawer
                overflowY: 'auto',
                // --- Aplicar offset para empezar DEBAJO del AppBar del logo ---
                pt: `${topOffset}px`,
                // --- FIN Aplicar offset ---
                borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                bgcolor: '#f4f6f8' // O un color de fondo que te guste
            }}
        >
            <List sx={{ p: 0.5, pt: 0.5 /* Ajustar pt */ }}>{/* Reducir padding lista */}
                {sidebarNavItems.map((item) => {
                    const isActive = item.path === location.pathname ||
                                     item.subItems?.some(sub => location.pathname.startsWith(sub.path));
                    const isMenuOpen = openMenuId === item.id; // Verificar si el menú de ESTE item está abierto

                    return (
                        <ListItem key={item.id} disablePadding sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                            <Tooltip title={item.name} placement="bottom">
                                <ListItemButton
                                    component={item.subItems ? 'button' : RouterNavLink} // Sigue siendo button si tiene subItems
                                    to={!item.subItems ? item.path : undefined}
                                    end={!item.subItems}
                                    // --- Usar Handlers de Hover ---
                                    onClick={!item.subItems ? () => handleNavigateAndClose(item.path) : undefined} // Navegar solo si no hay submenú
                                    onMouseEnter={item.subItems ? (e) => handleMouseEnter(e, item.id) : undefined}
                                    onMouseLeave={item.subItems ? handleMouseLeave : undefined}
                                    // --- Fin Handlers Hover ---
                                    aria-owns={isMenuOpen ? `${item.id}-popover` : undefined}
                                    aria-haspopup={item.subItems ? 'true' : undefined}
                                    sx={(theme) => sidebarButtonStyle(theme, item, isActive)}
                                    className={item.subItems && isActive ? 'active' : ''}
                                >
                                    <ListItemIcon sx={{ justifyContent: 'center', width: '100%', height: '100%' }}>{item.icon}</ListItemIcon>
                                    {/* <ListItemText primary={item.name} /> */}
                                </ListItemButton>
                            </Tooltip>

                            {/* Renderizar POPOVER si este item tiene subItems */}
                            {item.subItems && (
                                <Popover
                                    id={`${item.id}-popover`}
                                    open={isMenuOpen}
                                    anchorEl={anchorEl} // Usar el estado anchorEl general
                                    // --- Posicionamiento al lado ---
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                    // --- Fin Posicionamiento ---
                                    // Evitar cierre al hacer clic dentro del Popover
                                    disableRestoreFocus
                                    // Manejar entrada/salida del ratón en el Paper del Popover
                                    PaperProps={{
                                        onMouseEnter: handlePopoverEnter, // Mantener abierto
                                        onMouseLeave: handleMouseLeave, // Iniciar cierre al salir
                                        sx: { ml: 1, boxShadow: 3, minWidth: 200, pointerEvents: 'auto' } // Estilos
                                    }}
                                    sx={{ pointerEvents: 'none' /* Evitar bloqueo inicial */ }}
                                >
                                    <MenuList autoFocusItem={false}>
                                        {item.subItems.map((subItem) => (
                                            <MenuItem
                                                key={subItem.name}
                                                onClick={() => handleNavigateAndClose(subItem.path)} // Usar nuevo handler
                                                selected={location.pathname === subItem.path}
                                                // Aplicar estilo compacto si se definió en el tema
                                                // sx={{ py: 0.5, fontSize: '0.9rem' }}
                                            >
                                                {subItem.name}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </Popover>
                            )}
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );
};

export default Sidebar;