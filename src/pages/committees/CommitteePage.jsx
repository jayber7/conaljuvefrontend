// src/pages/committees/CommitteePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Grid, Avatar, List, ListItem, ListItemText, Button, CircularProgress, Alert } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import committeeData from '../../data/committeeData'; // <-- IMPORTAR DATOS
import { useParams } from 'react-router-dom';

// --- DATOS DE EJEMPLO (Reemplazar con carga dinámica o importar desde un archivo JSON/JS) ---
// Idealmente, estos datos vendrían de una API o un archivo de configuración
const CommitteePage = () => {
    const { committeeId } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        setError('');
        const foundData = committeeData[committeeId];
        if (foundData) {
            setData(foundData);
        } else {
            setError(`Información no disponible para el comité "${committeeId}".`);
            setData(null);
        }
    }, [committeeId]);

    // Quitar estado de loading
    if (error) return <Container><Alert severity="error">{error}</Alert></Container>;
    if (!data) return null; // O un componente NotFound simple

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={1} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: '8px' }}>
                <Typography variant="h1" component="h1" gutterBottom align="center">{data.title}</Typography>

                <Box sx={{ width: '100%', maxHeight: '400px', overflow: 'hidden', borderRadius: '8px', mb: 4 }}>
                    <img src={data.imageUrl || '/assets/placeholder.jpg'} alt={`Integrantes ${data.title}`} style={{ width: '100%', height: 'auto', objectFit: 'cover' }}/>
                </Box>

                {data.description && <Typography paragraph sx={{mb: 3}}>{data.description}</Typography>}

                <Grid container spacing={4}>
                    {/* Columna Miembros */}
                    <Grid item xs={12} md={data.statutesUrl || data.decreeUrl ? 7 : 12}> {/* Ocupa todo si no hay PDFs */}
                        <Typography variant="h4" component="h2" gutterBottom>Integrantes / Aliados</Typography>
                        {/* <DirectoryList members={data.members.map(m => ({ name: m }))} /> */}
                        <List dense>
                            {data.members && data.members.length > 0 ? (
                                data.members.map((member, index) => ( <ListItem key={index} disablePadding><ListItemText primary={member} /></ListItem> ))
                            ) : ( <ListItem><ListItemText primary="Información no disponible." /></ListItem> )}
                        </List>
                    </Grid>

                    {/* Columna Normativas (solo si hay algún PDF) */}
                    {(data.statutesUrl || data.decreeUrl) && (
                         <Grid item xs={12} md={5}>
                             <Typography variant="h4" component="h2" gutterBottom>Documentos</Typography>
                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                 {/* <PdfViewerLink href={data.statutesUrl} /> */}
                                 {data.statutesUrl && <Button variant="outlined" startIcon={<PictureAsPdfIcon />} href={data.statutesUrl} target="_blank" >Estatutos / Reglamento</Button>}
                                 {/* <PdfViewerLink href={data.decreeUrl} /> */}
                                 {data.decreeUrl && <Button variant="outlined" startIcon={<PictureAsPdfIcon />} href={data.decreeUrl} target="_blank" >Decreto / Normativa</Button>}
                             </Box>
                         </Grid>
                     )}
                </Grid>
            </Paper>
        </Container>
    );
};

export default CommitteePage;