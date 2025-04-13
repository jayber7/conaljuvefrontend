// src/pages/NotFoundPage.jsx
import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ReportProblemIcon from '@mui/icons-material/ReportProblem'; // Icono de advertencia

const NotFoundPage = () => {
  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '12px' }}>
        <ReportProblemIcon sx={{ fontSize: 80, color: 'secondary.main', mb: 2 }} />
        <Typography component="h1" variant="h3" align="center" color="text.primary" gutterBottom>
          Error 404
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          ¡Ups! Página No Encontrada
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </Typography>
        <Button
          component={RouterLink}
          to="/" // Enlace a la página de inicio
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Volver al Inicio
        </Button>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;