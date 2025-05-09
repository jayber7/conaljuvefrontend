// src/pages/ContactPage.jsx
import React from 'react';
import { Container, Typography, Box, Paper, Link, IconButton, Stack, Divider, Button } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import EmailIcon from '@mui/icons-material/Email';
import WebIcon from '@mui/icons-material/Web'; // Para desarrollo web
import BuildIcon from '@mui/icons-material/Build'; // Herramientas/Desarrollo

const ContactPage = () => {
  const developerName = "Ing. Hiver Tapia Domínguez";
  const whatsappNumber = "+59169799687";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\+/g, '')}`; // Formato para wa.me
  const facebookProfileUrl = "https://www.facebook.com/profile.php?id=100052020626227";
  const contactEmail = "hivertapiad@gmail.com"; // Tu email de contacto profesional

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: '12px' }}>
        <Typography variant="h1" component="h1" align="center" gutterBottom>
          Contacto
        </Typography>
        <Typography variant="h5" component="h2" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Información de Desarrollo y Contacto del Portal
        </Typography>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h6" component="p" gutterBottom>
            Este portal fue desarrollado por:
          </Typography>
          <Typography variant="h4" component="p" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
            {developerName}
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
            {whatsappNumber && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<WhatsAppIcon />}
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </Button>
            )}
            {facebookProfileUrl && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<FacebookIcon />}
                href={facebookProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </Button>
            )}
            {contactEmail && (
               <Button
                variant="outlined"
                size="small"
                startIcon={<EmailIcon />}
                href={`mailto:${contactEmail}`}
              >
                Correo
              </Button>
            )}
          </Stack>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" component="h2" color="secondary.main" gutterBottom sx={{ fontWeight: 'bold' }}>
            ¿Necesitas una Solución Web Moderna y Funcional?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 1, maxWidth: '700px', mx: 'auto' }}>
            Transforma tu organización o negocio con una aplicación web a medida.
            Desarrollo especializado en portales informativos, sistemas de gestión, plataformas comunitarias y más, utilizando las últimas tecnologías para asegurar rendimiento, seguridad y una excelente experiencia de usuario.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 2 }}>
            <WebIcon fontSize="small"/> <Typography variant="body2">React, Node.js, Material UI</Typography>
            <BuildIcon fontSize="small"/> <Typography variant="body2">APIs, Bases de Datos, Despliegue</Typography>
          </Box>
          <Typography variant="body1" paragraph sx={{ maxWidth: '700px', mx: 'auto' }}>
            Si buscas digitalizar tus procesos, mejorar tu presencia online o crear una nueva plataforma interactiva, ¡hablemos de tu proyecto!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            href={`mailto:${contactEmail}?subject=Consulta%20Desarrollo%20Web`} // Asunto predefinido
            sx={{ mt: 1, color: 'primary.dark', fontWeight: 'bold' }}
          >
            Contáctame para tu Proyecto
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ContactPage;