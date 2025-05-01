// src/pages/federations/FederationDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Alert, List, ListItem, ListItemText } from '@mui/material'; // Quitar Button si se usa PdfViewerLink
import federationData from '../../data/federationData';

// --- IMPORTAR COMPONENTES REUTILIZABLES ---
import DirectoryList from '../../components/Content/DirectoryList';
import PdfViewerLink from '../../components/Content/PdfViewerLink';
// --- FIN IMPORTAR ---


const FederationDetailPage = ({ type }) => {
    const { deptId } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        setError('');
        const upperDeptId = deptId.toUpperCase(); // Ej: 'lp' -> 'LP'
        console.log(`Buscando datos para type: ${type}, deptId: ${deptId}, upperDeptId: ${upperDeptId}`);
        console.log('Datos disponibles:', federationData[type]);
    
        // La búsqueda ahora debería encontrar la clave 'LP', 'CB', etc.
        const foundData = federationData[type]?.[upperDeptId];
    
        console.log('Datos encontrados:', foundData);
        if (foundData){setData(foundData)}
        // ... (resto del efecto) ...
    }, [type, deptId]);

    if (error) return <Container><Alert severity="error">{error}</Alert></Container>;
    if (!data) return null;

    return (
         <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={1} sx={{ p: { xs: 2, sm: 3, md: 4 }}}>
                 <Typography variant="h1" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                    {data.name}
                 </Typography>

                 {data.description && <Typography paragraph sx={{mb: 3}}>{data.description}</Typography>}

                 {/* Mostrar lista de municipios si es tipo 'muni' */}
                 {type === 'muni' && data.municipalities && data.municipalities.length > 0 && (
                     <Box sx={{ mb: 4 }}>
                         <Typography variant="h4" component="h2" gutterBottom>Federaciones Municipales</Typography>
                         {/* Podrías crear un componente específico o mejorar DirectoryList */}
                         <List dense>
                            {data.municipalities.map((muni, i) => <ListItem key={i}><ListItemText primary={muni.name} /></ListItem>)}
                         </List>
                     </Box>
                 )}

                 {/* Mostrar directorio usando el componente */}
                 {!(type === 'muni' && data.municipalities) && data.directory && data.directory.length > 0 && (
                     <Box sx={{ mb: 4 }}>
                         <Typography variant="h4" component="h2" gutterBottom>Directorio</Typography>
                         <DirectoryList members={data.directory} />
                     </Box>
                 )}

                 {/* Mostrar Estatuto usando el componente */}
                  {data.statutesUrl && (
                     <Box sx={{ mb: 4 }}>
                         <Typography variant="h4" component="h2" gutterBottom>Estatuto Orgánico</Typography>
                          <PdfViewerLink href={data.statutesUrl} buttonText="Ver/Descargar Estatuto"/>
                     </Box>
                 )}

             </Paper>
         </Container>
    );
};

export default FederationDetailPage;