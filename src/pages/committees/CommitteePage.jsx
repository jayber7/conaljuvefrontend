// src/pages/committees/CommitteePage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Grid, Avatar, List, ListItem, ListItemText, Button, CircularProgress, Alert } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

// --- DATOS DE EJEMPLO (Reemplazar con carga dinámica o importar desde un archivo JSON/JS) ---
// Idealmente, estos datos vendrían de una API o un archivo de configuración
const committeeData = {
    juventud: {
        title: 'Comité de Juventud',
        detail:'La Misión de la Comisión de Juventudes es empoderar a los jóvenes de las ciudades urbanas, proporcionándoles las herramientas, conocimientos y oportunidades necesarias para ser agentes activos de cambio en su Zonas/barrios/comunidad. A través de la educación, el liderazgo, la participación en formación y capacitación orientados al emprendimiento en colaboración con alianzas estratégicas en su sector, buscamos que los jóvenes desempeñen un papel fundamental en la transformación política, económica y social de su entorno. De esta manera, fomentamos la creación de soluciones innovadoras y sostenibles para los desafíos urbanos, promoviendo el desarrollo integral de la juventud y su impacto positivo en la sociedad.',
        imageUrl: '/assets/committees/juventud-placeholder.jpg', // Ruta a la imagen en public/assets o src/assets
        members: [
            'Juan Perez (Coordinador)',
            'Maria Garcia (Secretaria)',
            'Carlos Lopez',
            'Ana Ramirez',
        ],
        statutesUrl: '/docs/estatuto-juventud.pdf', // Ruta al PDF en public/docs
        decreeUrl: '/docs/decreto-supremo-juventud.pdf', // Ruta al PDF en public/docs
    },
    profesionales: {
        title: 'Comité de Profesionales',
        detail:'Integrar profesionales en áreas clave dentro de las Juntas Vecinales para fortalecer la gestión de las juntas vecinales, promover el bienestar social, y fomentar la participación activa de los vecinos en la resolución de problemas locales, garantizando el desarrollo sostenible y la mejora continua de los vecinos.',
        imageUrl: '/assets/committees/profesionales-placeholder.jpg',
        members: [
            'Dr. Alberto Rios (Presidente)',
            'Lic. Sofia Marquez (Vicepresidenta)',
            'Ing. David Flores',
            'Arq. Laura Mendoza',
        ],
        statutesUrl: '/docs/estatuto-profesionales.pdf',
        decreeUrl: null, // No todos tienen decreto supremo
    },
    mujeres: {
        title: 'Comité de Mujeres "Bartolina Sisa"', // Nombre más específico
        detail:'Fomentar el empoderamiento de las mujeres en las juntas vecinales de Bolivia, promoviendo su formación, emprendimiento y participación democrática. Esto se logrará mediante la educación, el desarrollo del liderazgo, la equidad de género y el acceso a la justicia, creando condiciones favorables para su desarrollo integral en los ámbitos social, político y económico. Todo esto con el fin de garantizar su inclusión activa en los procesos de toma de decisiones y gestión dentro de las comunidades urbanas, asegurando que las mujeres puedan ser protagonistas en la construcción de su futuro y el de sus comunidades.',
        imageUrl: '/assets/committees/mujeres-placeholder.jpg',
        members: [ 'Elena Quispe (Líder)', 'Rosa Mamani', 'Carmen Choque' ],
        statutesUrl: '/docs/estatuto-mujeres.pdf',
        decreeUrl: null,
    },
    salud: {
        title: 'Comité de Salud Comunitaria',
        detail:'',
        imageUrl: '/assets/committees/salud-placeholder.jpg',
        members: [ 'Dra. Isabel Castillo', 'Lic. Enf. Mario Vega', 'Promotor Luis Cruz' ],
        statutesUrl: null, // Puede no tener estatuto propio
        decreeUrl: '/docs/normativa-salud.pdf',
    },
     aliados: {
        title: 'Aliados Estratégicos',
        detail:'',
        imageUrl: '/assets/committees/aliados-placeholder.jpg',
        members: [
            'ONG "Desarrollo Andino"',
            'Fundación "Techo Bolivia"',
            'Universidad Mayor de San Andrés (UMSA) - Proyectos Sociales',
            'Ministerio de Planificación (Coordinación)', // Ejemplo
        ],
        // Para aliados, quizás no aplican estatutos/decretos de la misma forma
        statutesUrl: null,
        decreeUrl: null,
    }
    // Añade más comités si es necesario
};
// --- FIN DATOS DE EJEMPLO ---


const CommitteePage = ({ committeeId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        setError('');
        // Simular carga (en un caso real, harías fetch a una API)
        const foundData = committeeData[committeeId];
        if (foundData) {
            // Simular un pequeño delay
            setTimeout(() => {
                 setData(foundData);
                 setLoading(false);
            }, 300);
        } else {
            setError(`No se encontró información para el comité "${committeeId}".`);
            setLoading(false);
        }
    }, [committeeId]); // Recargar si cambia el ID del comité

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Container maxWidth="md" sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
    }

    if (!data) {
        return null; // O un mensaje de "No data"
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: '12px' }}>
                {/* Título */}
                <Typography variant="h1" component="h1" gutterBottom align="center">
                    {data.title}
                </Typography>
                <Typography variant="h1" component="h1" gutterBottom align="center">
                    {data.detail}
                </Typography>
                {/* Imagen */}
                <Box sx={{ width: '100%', maxHeight: '400px', overflow: 'hidden', borderRadius: '8px', mb: 4 }}>
                    <img src={data.imageUrl || '/assets/placeholder.jpg'} // Imagen placeholder por defecto
                         alt={`Integrantes ${data.title}`}
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                </Box>

                <Grid container spacing={4}>
                    {/* Columna Miembros */}
                    <Grid item xs={12} md={7}>
                        <Typography variant="h4" component="h2" gutterBottom>
                            Integrantes
                        </Typography>
                        <List dense>
                            {data.members && data.members.length > 0 ? (
                                data.members.map((member, index) => (
                                    <ListItem key={index} disablePadding>
                                        <ListItemText primary={member} />
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem><ListItemText primary="Información de miembros no disponible." /></ListItem>
                            )}
                        </List>
                    </Grid>

                    {/* Columna Normativas */}
                    <Grid item xs={12} md={5}>
                         <Typography variant="h4" component="h2" gutterBottom>
                            Normativas
                         </Typography>
                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {data.statutesUrl ? (
                                <Button
                                    variant="outlined"
                                    startIcon={<PictureAsPdfIcon />}
                                    href={data.statutesUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Ver Estatutos / Reglamento
                                </Button>
                            ) : (
                                 <Typography variant='body2' color='text.secondary'>(Estatutos no disponibles)</Typography>
                            )}

                             {data.decreeUrl ? (
                                <Button
                                    variant="outlined"
                                    startIcon={<PictureAsPdfIcon />}
                                    href={data.decreeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Ver Decreto Supremo / Normativa Relacionada
                                </Button>
                             ) : (
                                  <Typography variant='body2' color='text.secondary'>(Decreto/Normativa no disponible)</Typography>
                             )}
                             {/* Añadir más botones si hay otros documentos */}
                         </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default CommitteePage;