// src/pages/HowToBeMemberPage.jsx
import React from 'react';
import { Container, Typography, Box, Paper, List, ListItem, ListItemIcon, ListItemText, Button, Divider, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'; // Para registro
import RuleFolderIcon from '@mui/icons-material/RuleFolder'; // Para normas
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Para beneficios

const HowToBeMemberPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: '12px' }}>
        <Typography variant="h1" component="h1" align="center" gutterBottom>
          Sé Parte de CONALJUVE
        </Typography>
        <Typography variant="h5" component="h2" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Únete a la Confederación Nacional de Juntas Vecinales de Bolivia y fortalece tu comunidad.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom color="primary.dark">
            <AssignmentIndIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Proceso de Registro
          </Typography>
          <Typography paragraph>
            Registrarse como miembro oficial de una junta vecinal afiliada a CONALJUVE es un paso importante para formalizar tu participación y acceder a los beneficios de nuestra confederación. El proceso es sencillo:
          </Typography>
          <List>
            <ListItem><ListItemIcon><CheckCircleOutlineIcon color="secondary"/></ListItemIcon><ListItemText primary="Reúne tu información personal y la de tu junta vecinal (Nombre completo, CI, Ubicación de la junta, Cargo que desempeñas, etc.)." /></ListItem>
            <ListItem><ListItemIcon><CheckCircleOutlineIcon color="secondary"/></ListItemIcon><ListItemText primary="Accede a nuestro formulario de registro de miembros haciendo clic en el botón de abajo." /></ListItem>
            <ListItem><ListItemIcon><CheckCircleOutlineIcon color="secondary"/></ListItemIcon><ListItemText primary="Completa todos los campos requeridos con información veraz y actualizada." /></ListItem>
            <ListItem><ListItemIcon><CheckCircleOutlineIcon color="secondary"/></ListItemIcon><ListItemText primary="Sube una fotografía reciente (opcional pero recomendado)." /></ListItem>
            <ListItem><ListItemIcon><CheckCircleOutlineIcon color="secondary"/></ListItemIcon><ListItemText primary="Envía tu solicitud. Recibirás un código de registro único." /></ListItem>
            <ListItem><ListItemIcon><CheckCircleOutlineIcon color="secondary"/></ListItemIcon><ListItemText primary="Tu registro será revisado por el equipo de CONALJUVE para su verificación." /></ListItem>
            <ListItem><ListItemIcon><CheckCircleOutlineIcon color="secondary"/></ListItemIcon><ListItemText primary="Una vez verificado, podrás vincular tu registro a tu cuenta del portal (si te has logueado con Google) para acceder a contenido y funciones exclusivas para miembros." /></ListItem>
          </List>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={RouterLink}
              to="/registro-miembro" // Enlace al formulario
              sx={{ color: 'primary.dark', fontWeight: 'bold' }}
            >
              Ir al Formulario de Registro de Miembro
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom color="primary.dark">
            <EmojiEventsIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Beneficios de ser Miembro Verificado
          </Typography>
          <List>
            <ListItem><ListItemIcon><CheckCircleOutlineIcon color="primary"/></ListItemIcon><ListItemText primary="Representación y respaldo a nivel nacional por CONALJUVE." /></ListItem>
            <ListItem><ListItemIcon><CheckCircleOutlineIcon color="primary"/></ListItemIcon><ListItemText primary="Acceso a información, capacitaciones y recursos exclusivos para miembros." /></ListItem>
            <ListItem><ListItemIcon><CheckCircleOutlineIcon color="primary"/></ListItemIcon><ListItemText primary="Posibilidad de participar en procesos de toma de decisiones y votaciones internas (según estatutos)." /></ListItem>
            <ListItem><ListItemIcon><CheckCircleOutlineIcon color="primary"/></ListItemIcon><ListItemText primary="Fortalecimiento de tu junta vecinal a través de la red nacional." /></ListItem>
            <ListItem><ListItemIcon><CheckCircleOutlineIcon color="primary"/></ListItemIcon><ListItemText primary="Generación de una credencial digital (comprobante PDF) y futura credencial física (con posible costo)." /></ListItem>
            {/* Añade más beneficios */}
          </List>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h4" component="h2" gutterBottom color="primary.dark">
            <RuleFolderIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Normas y Reglas
          </Typography>
          <Typography paragraph>
            Al registrarte como miembro, aceptas cumplir con los estatutos y reglamentos de CONALJUVE y de tu junta vecinal. Te comprometes a actuar con ética, transparencia y en beneficio de tu comunidad.
          </Typography>
          <Typography paragraph>
            Para más detalles, puedes consultar nuestro <Link component={RouterLink} to="/institucion/estatuto">Estatuto Orgánico</Link> y otras normativas relevantes.
          </Typography>
          {/* Podrías añadir más detalles o enlaces a documentos específicos aquí */}
        </Box>

      </Paper>
    </Container>
  );
};

export default HowToBeMemberPage;