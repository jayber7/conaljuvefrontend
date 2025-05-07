// src/components/Home/StatCard.jsx
import React from 'react';
import { Paper, Box, Typography, Avatar } from '@mui/material';

const StatCard = ({ icon, title, value, color = "primary.main", iconBgColor = "primary.light" }) => {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                borderRadius: 2,
                '&:hover': { boxShadow: 4 } // Opcional: Sombra al pasar
            }}
        >
            <Avatar
                sx={{
                    bgcolor: iconBgColor, // Color de fondo del avatar del icono
                    width: 48,
                    height: 48,
                }}
            >
                {React.cloneElement(icon, { sx: { color: color, fontSize: '1.6rem' } })}
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' /* Alinear texto a la izquierda */ }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: color,lineHeight: 1.1,mb: 0.25  }}>
                    {value !== null && value !== undefined ? value : '...'}
                </Typography>
                <Typography
                    variant="caption" // Hacerlo más pequeño
                    component="div" // Para permitir múltiples líneas si es necesario
                    color="text.secondary"
                    sx={{
                        lineHeight: 1.3, // Ajustar para 2 líneas
                        // --- Opcional: Limitar a 2 líneas con elipsis ---
                        // display: '-webkit-box',
                        // WebkitLineClamp: 2,
                        // WebkitBoxOrient: 'vertical',
                        // overflow: 'hidden',
                        // textOverflow: 'ellipsis',
                        // height: 'calc(1.3em * 2)', // Ajustar si WebkitLineClamp no funciona bien solo
                        // --- Fin Opcional ---
                    }}
                >
                    {title}
                </Typography>
            </Box>
        </Paper>
    );
};

export default StatCard;