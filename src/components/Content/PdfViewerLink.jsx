// src/components/Content/PdfViewerLink.jsx
import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const PdfViewerLink = ({ href, description, buttonText = "Ver / Descargar Documento", sx = {} }) => {
    if (!href) return null; // No renderizar si no hay enlace

    return (
        <Box sx={{ textAlign: 'center', ...sx }}> {/* Permitir pasar estilos al Box */}
            {description && <Typography paragraph variant="body2" color="text.secondary" sx={{ mb: 1 }}>{description}</Typography>}
            <Button
                variant="contained" // Cambiado a contained para más énfasis
                color="primary" // O secondary
                startIcon={<PictureAsPdfIcon />}
                href={href}
                target="_blank" // Abrir en nueva pestaña
                rel="noopener noreferrer"
            >
                {buttonText}
            </Button>
        </Box>
    );
};

export default PdfViewerLink;