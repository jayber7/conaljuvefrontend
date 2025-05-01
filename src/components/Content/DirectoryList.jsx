// src/components/Content/DirectoryList.jsx
import React from 'react';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';

const DirectoryList = ({ members, sx = {} }) => {
    if (!members || members.length === 0) {
        return <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', ...sx }}>Información de directorio no disponible.</Typography>;
    }

    return (
        <List dense sx={sx}> {/* Permitir pasar estilos */}
            {members.map((member, index) => (
                <ListItem key={index} disablePadding sx={{ pb: 0.5 }}> {/* Pequeño padding bottom */}
                    <ListItemText
                        primary={member.name}
                        secondary={member.role || null} // Mostrar rol si existe
                        primaryTypographyProps={{ fontWeight: 500 }} // Nombre un poco más destacado
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default DirectoryList;