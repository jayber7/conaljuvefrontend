// src/components/Content/InfoSection.jsx
import React from 'react';
import { Box, Typography,List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // O otro icono
// Acepta un array de objetos { subtitle: '...', text: '...' }
const InfoSection = ({ content, sx = {} }) => {
    if (!content || content.length === 0) return null;
    // Función para detectar si una línea parece un item de lista (simple)
    const isListItem = (line) => /^\s*([a-lA-L][\)\.]|\d+[\.\)])\s+/.test(line.trim());
    // Función para extraer el texto del item de lista
    const getListItemText = (line) => line.trim().replace(/^\s*([a-lA-L][\)\.]|\d+[\.\)])\s+/, '')
    return (
        <Box sx={sx}>
            {content.map((paragraph, index) => (
                <Box key={index} sx={{ mb: 2.5 }}>
                    {paragraph.subtitle && (
                        <Typography variant="h5" component="h3" gutterBottom color="primary.dark">
                            {paragraph.subtitle}
                        </Typography>
                    )}
                    {paragraph.text && (
                        // Renderizar como lista si detecta items, si no como párrafos
                        paragraph.text.split('\n').some(isListItem) ? (
                            <List dense sx={{ pl: 2 }}> {/* Añadir padding izquierdo a la lista */}
                                {paragraph.text.split('\n').map((line, lineIndex) => (
                                   isListItem(line) ? (
                                       <ListItem key={lineIndex} sx={{ py: 0.2, alignItems: 'flex-start' }}>
                                           {/* <ListItemIcon sx={{ minWidth: 30, mt: 0.5 }}><CheckCircleOutlineIcon fontSize="small" color="secondary"/></ListItemIcon> */}
                                           <ListItemText primary={getListItemText(line)} />
                                       </ListItem>
                                    ) : (
                                        // Renderizar líneas que no son items como texto normal (si las hubiera)
                                        line.trim() && <Typography key={lineIndex} paragraph sx={{ mb: 0.5 }}>{line}</Typography>
                                    )
                                ))}
                            </List>
                        ) : (
                             // Renderizar como párrafos normales si no detecta formato de lista
                             paragraph.text.split('\n').map((line, lineIndex) => (
                                <Typography key={lineIndex} paragraph sx={{ mb: 1 }}>
                                    {line || <> </>}
                                </Typography>
                             ))
                         )
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default InfoSection;