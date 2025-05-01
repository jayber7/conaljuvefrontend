// src/components/Content/InfoSection.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

// Acepta un array de objetos { subtitle: '...', text: '...' }
const InfoSection = ({ content, sx = {} }) => {
    if (!content || content.length === 0) return null;

    return (
        <Box sx={sx}> {/* Permitir pasar estilos */}
            {content.map((paragraph, index) => (
                <Box key={index} sx={{ mb: 2.5 /* Espacio entre secciones/párrafos */ }}>
                    {paragraph.subtitle && (
                        <Typography variant="h5" component="h3" gutterBottom color="primary.dark">
                            {paragraph.subtitle}
                        </Typography>
                    )}
                    {paragraph.text && paragraph.text.split('\n').map((line, lineIndex) => (
                        <Typography key={lineIndex} paragraph sx={{ mb: 1 /* Margen entre líneas */ }}>
                            {line || <> </>} {/* Espacio para líneas vacías */}
                        </Typography>
                    ))}
                </Box>
            ))}
        </Box>
    );
};

export default InfoSection;