// src/pages/tribunals/TribunalListPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Container, Typography, Box, Paper, Grid, Select, MenuItem, FormControl, InputLabel, CircularProgress, Alert, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext'; // Para botón de admin
import { Link as RouterLink } from 'react-router-dom'; // Para enlaces
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// Necesitarás cargar Departamentos/Municipios si filtras por código numérico
// import useLocationData from '../../hooks/useLocationData'; // Ejemplo de hook personalizado

const TribunalListPage = () => {
    const { isAdmin } = useAuth(); // Para botón de gestión
    const [tribunals, setTribunals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterLevel, setFilterLevel] = useState(''); // DEPARTAMENTAL, MUNICIPAL, VECINAL
    const [filterLocation, setFilterLocation] = useState(''); // Para buscar por nombre/código específico
    // Estados para cargar ubicaciones si se necesita filtrar por código numérico
    // const { departments, provinces, municipalities, loading: loadingLocations } = useLocationData();

    const fetchTribunals = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const params = {
                level: filterLevel || undefined,
                // locationCode: filterLocation || undefined, // Búsqueda por código es más compleja con diferentes tipos
                locationName: filterLocation || undefined, // Buscar por nombre es más simple aquí
                sort: 'level locationName',
                limit: 100 // O implementar paginación si hay muchos
            };
             Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
            const response = await api.get('/tribunals', { params });
            setTribunals(response.data.data.tribunals || []);
        } catch (err) { setError('Error al cargar los tribunales.'); console.error(err); }
        finally { setLoading(false); }
    }, [filterLevel, filterLocation]);

    useEffect(() => {
        fetchTribunals();
    }, [fetchTribunals]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>


            {/* --- Filtros --- */}
            <Paper sx={{ p: 2, mb: 3 }} variant="outlined">
                <Grid container spacing={2}>
                     <Grid item xs={12} sm={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Nivel</InputLabel>
                            <Select value={filterLevel} label="Nivel" onChange={(e) => setFilterLevel(e.target.value)}>
                                <MenuItem value=""><em>Todos</em></MenuItem>
                                <MenuItem value="DEPARTAMENTAL">Departamental</MenuItem>
                                <MenuItem value="MUNICIPAL">Municipal</MenuItem>
                                <MenuItem value="VECINAL">Vecinal/Comunitario</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                     <Grid item xs={12} sm={8}>
                         <TextField
                            fullWidth size="small" label="Buscar por Nombre de Ubicación"
                            value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}
                            // Podrías añadir debounce aquí
                         />
                    </Grid>
                </Grid>
            </Paper>

            {/* --- Lista de Tribunales --- */}
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && tribunals.length === 0 && <Typography>No se encontraron tribunales con los filtros aplicados.</Typography>}
            {!loading && !error && tribunals.length > 0 && (
                 <Paper variant="outlined">
                     <List disablePadding>
                         {tribunals.map((tribunal, index) => (
                             <React.Fragment key={tribunal._id}>
                                 <ListItem>
                                     <ListItemText
                                         primary={`${tribunal.level}: ${tribunal.locationName}`}
                                         secondary={`Conformado: ${tribunal.termStartDate ? format(new Date(tribunal.termStartDate),'dd/MM/yy') : 'N/A'} - Fin: ${tribunal.termEndDate ? format(new Date(tribunal.termEndDate),'dd/MM/yy') : 'N/A'}`}
                                         primaryTypographyProps={{fontWeight: 'bold'}}
                                     />
                                     {/* Añadir botón para ver detalle si creas esa página/modal */}
                                     {/* <Button component={RouterLink} to={`/tribunales/detalle/${tribunal._id}`}>Ver</Button> */}
                                 </ListItem>
                                 {/* Mostrar Directorio */}
                                 {tribunal.directory && tribunal.directory.length > 0 && (
                                     <List dense disablePadding sx={{ pl: 4, mb: 1 }}>
                                        {tribunal.directory.map((m, i) => <ListItem key={i} sx={{py:0}}><ListItemText secondary={`${m.role}: ${m.fullName}`} /></ListItem>)}
                                     </List>
                                 )}
                                 {/* Mostrar Enlaces PDF */}
                                 <Box sx={{ pl: 4, mb: 1, display: 'flex', gap: 1 }}>
                                     {tribunal.statuteUrl && <Button size="small" variant="text" startIcon={<PictureAsPdfIcon />} href={tribunal.statuteUrl} target="_blank">Estatuto/Reglamento</Button>}
                                     {tribunal.regulationsUrl && <Button size="small" variant="text" startIcon={<PictureAsPdfIcon />} href={tribunal.regulationsUrl} target="_blank">Régimen/Normativa</Button>}
                                 </Box>
                                 {index < tribunals.length - 1 && <Divider component="li" />}
                             </React.Fragment>
                         ))}
                     </List>
                 </Paper>
             )}
        </Container>
    );
};

export default TribunalListPage;