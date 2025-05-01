// src/components/Content/ImageDisplay.jsx
import React from 'react';
import { Box } from '@mui/material';

const ImageDisplay = ({ src, alt, maxWidth = '100%', sx = {} }) => {
    if (!src) return null; // No renderizar nada si no hay src

    return (
        <Box
            sx={{
                width: '100%', // Ocupar ancho disponible
                textAlign: 'center', // Centrar imagen si es más pequeña que el contenedor
                mb: 3, // Margen inferior por defecto
                ...sx // Permite pasar estilos adicionales
            }}
        >
            <img
                src={src}
                alt={alt}
                style={{
                    maxWidth: maxWidth, // Ancho máximo
                    height: 'auto', // Mantener proporción
                    border: '1px solid #ddd', // Borde sutil
                    borderRadius: '4px', // Bordes suaves
                    display: 'inline-block' // Para que el centrado funcione bien
                }}
            />
        </Box>
    );
};

export default ImageDisplay;