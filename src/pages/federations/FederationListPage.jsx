// src/pages/federations/FederationListPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, List, ListItem, ListItemButton, ListItemText, CircularProgress, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../../services/api';

// Recibe 'type' (dptales, muni, coord) y 'title' como props desde App.jsx
const FederationListPage = ({ type, title }) => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            setLoading(true); setError('');
            try {
                const response = await api.get('/locations/departments');
                setDepartments(response.data.data.departments || []);
            } catch (err) { setError('No se pudieron cargar los departamentos.'); }
             finally { setLoading(false); }
        };
        fetchDepartments();
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
    if (error) return <Container><Alert severity="error">{error}</Alert></Container>;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h1" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                {title}
            </Typography>
            <Paper elevation={1} sx={{ p: 2 }}>
                <Typography sx={{ mb: 2 }}>Seleccione un departamento para ver la información:</Typography>
                <List>
                    {departments.map((dept) => (
                        <ListItem key={dept.code} disablePadding>
                            {/* Construir la URL correcta basada en el tipo */}
                            
                            <ListItemButton component={RouterLink} to={`/federaciones/${type}/${(dept.abbreviation || dept.code).toString().toLowerCase()}`}>
                                <ListItemText primary={dept.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                 {/* Aquí podrías añadir un mapa interactivo de Bolivia en lugar de la lista */}
            </Paper>
        </Container>
    );
};

export default FederationListPage;