import React, { useState, useRef } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Paper, Tooltip, Menu, MenuItem, Popover, MenuList } from '@mui/material';
import { NavLink as RouterNavLink, useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import MapIcon from '@mui/icons-material/Map';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GavelIcon from '@mui/icons-material/Gavel';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';

const sidebarButtonSize = 52;

const sidebarNavItems = [
    { id: 'inicio', name: 'Inicio', path: '/', icon: <HomeIcon /> },
    {
      id: 'institucion', name: 'Institución', icon: <AccountBalanceIcon />,
      subItems: [
        { name: '¿Qué es CONALJUVE?', path: '/sobre-conaljuve' },
        { name: 'COMITÉ EJECUTIVO NACIONAL (C.E.N.)', path: '/institucion/organigrama' },
        { name: 'Estatuto Orgánico', path: '/institucion/estatuto' },
        { name: 'Directorio Nacional', path: '/institucion/directorio-nacional' },
        { name: 'Visión y Misión', path: '/institucion/vision-mision' },
        { name: 'Objeto y Fines', path: '/institucion/objeto-fines' },
        { name: 'Tribunal de honor y disiplinario', path: '/institucion/tribunal' },
      ]
    },
    { id: 'registro', name: 'Registro', path: '/registro-miembro', icon: <HowToRegIcon /> },
    {
      id: 'federaciones_dptales', name: 'Federaciones Departamentales', icon: <SouthAmericaIcon />,
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
      id: 'federaciones_muni', name: 'Federaciones Municipales', icon: <LocationCityIcon />,
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
      id: 'coordinadoras', name: 'Coordinadoras', icon: <ConnectWithoutContactIcon />,
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
      id: 'comites', name: 'Comités', icon: <GroupsIcon />,
      subItems: [
        { name: 'Comité de Juventud', path: '/comites/juventud' },
        { name: 'Comité de Profesionales', path: '/comites/profesionales' },
        { name: 'Comité de Mujeres', path: '/comites/mujeres' },
        { name: 'Comité de Salud', path: '/comites/salud' },
        { name: 'Aliados Estratégicos', path: '/comites/aliados' },
      ]
    },
    { id: 'proyectos', name: 'Proyectos', path: '/proyectos', icon: <AssignmentIcon /> },
    { id: 'tribunales', name: 'Tribunales', path: '/tribunales', icon: <GavelIcon /> },
];

const sidebarButtonStyle = (theme, isActive) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: `${sidebarButtonSize}px`,
    height: `${sidebarButtonSize}px`,
    borderRadius: '12px',
    mb: 1,
    p: 0,
    color: isActive ? '#ffffff' : theme.palette.text.secondary,
    backgroundColor: isActive ? 'linear-gradient(135deg, #003366 0%, #004d99 100%)' : 'transparent',
    background: isActive ? 'linear-gradient(135deg, #003366 0%, #004d99 100%)' : 'transparent',
    border: 'none',
    boxShadow: isActive ? '0 4px 12px rgba(0, 51, 102, 0.3)' : 'none',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    '& .MuiListItemIcon-root': {
        minWidth: 'auto', 
        fontSize: `${sidebarButtonSize * 0.55}px`,
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'inherit',
        transition: 'inherit',
    },
    '&:hover': {
        backgroundColor: isActive ? 'linear-gradient(135deg, #003366 0%, #004d99 100%)' : 'rgba(0, 51, 102, 0.08)',
        background: isActive ? 'linear-gradient(135deg, #003366 0%, #004d99 100%)' : 'rgba(0, 51, 102, 0.08)',
        color: isActive ? '#ffffff' : '#003366',
        transform: 'scale(1.08)',
        boxShadow: isActive ? '0 6px 16px rgba(0, 51, 102, 0.4)' : '0 2px 8px rgba(0, 51, 102, 0.15)',
    }
});

export const drawerWidth = 72;

const Sidebar = ({ topOffset = 0 }) => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const leaveTimeoutRef = useRef(null);
    const enterTimeoutRef = useRef(null);

    const handleMouseEnter = (event, menuId) => {
        clearTimeout(leaveTimeoutRef.current);
        setAnchorEl(event.currentTarget);
        setOpenMenuId(menuId);
    };

    const handleMouseLeave = () => {
        clearTimeout(enterTimeoutRef.current);
        leaveTimeoutRef.current = setTimeout(() => {
            setAnchorEl(null);
            setOpenMenuId(null);
        }, 200);
    };

    const handlePopoverEnter = () => {
        clearTimeout(leaveTimeoutRef.current);
    };

    const handleNavigateAndClose = (path) => {
         clearTimeout(leaveTimeoutRef.current);
         clearTimeout(enterTimeoutRef.current);
         setAnchorEl(null);
         setOpenMenuId(null);
         navigate(path);
    };

    return (
        <Paper 
        elevation={0}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: (theme) => theme.zIndex.drawer,
                overflowY: 'auto',
                pt: `${topOffset}px`,
                borderRight: '1px solid #E2E8F0',
                bgcolor: '#ffffff',
                boxShadow: '2px 0 8px rgba(0, 0, 0, 0.04)',
            }}
        >
            <List sx={{ p: 0.75, pt: 1 }}>
                {sidebarNavItems.map((item) => {
                    const isActive = item.path === location.pathname ||
                                     item.subItems?.some(sub => location.pathname.startsWith(sub.path));
                    const isMenuOpen = openMenuId === item.id;

                    return (
                        <ListItem key={item.id} disablePadding sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                            <Tooltip title={item.name} placement="right" arrow>
                                <ListItemButton
                                    component={item.subItems ? 'button' : RouterNavLink}
                                    to={!item.subItems ? item.path : undefined}
                                    end={!item.subItems}
                                    onClick={!item.subItems ? () => handleNavigateAndClose(item.path) : undefined}
                                    onMouseEnter={item.subItems ? (e) => handleMouseEnter(e, item.id) : undefined}
                                    onMouseLeave={item.subItems ? handleMouseLeave : undefined}
                                    aria-owns={isMenuOpen ? `${item.id}-popover` : undefined}
                                    aria-haspopup={item.subItems ? 'true' : undefined}
                                    sx={(theme) => sidebarButtonStyle(theme, isActive)}
                                >
                                    <ListItemIcon sx={{ justifyContent: 'center', width: '100%', height: '100%' }}>{item.icon}</ListItemIcon>
                                </ListItemButton>
                            </Tooltip>

                            {item.subItems && (
                                <Popover
                                    id={`${item.id}-popover`}
                                    open={isMenuOpen}
                                    anchorEl={anchorEl}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                    disableRestoreFocus
                                    PaperProps={{
                                        onMouseEnter: handlePopoverEnter,
                                        onMouseLeave: handleMouseLeave,
                                        sx: { 
                                            ml: 1, 
                                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                                            minWidth: 220, 
                                            pointerEvents: 'auto',
                                            borderRadius: '12px',
                                            border: '1px solid #E2E8F0',
                                        }
                                    }}
                                    sx={{ pointerEvents: 'none' }}
                                >
                                    <MenuList autoFocusItem={false} sx={{ py: 0.5 }}>
                                        {item.subItems.map((subItem) => (
                                            <MenuItem
                                                key={subItem.name}
                                                onClick={() => handleNavigateAndClose(subItem.path)}
                                                selected={location.pathname === subItem.path}
                                                sx={{
                                                    py: 1,
                                                    px: 2,
                                                    fontSize: '0.875rem',
                                                    borderRadius: '8px',
                                                    mx: 0.5,
                                                    my: 0.25,
                                                }}
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
