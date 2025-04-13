import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://conaljuve.org.bo/"> {/* Enlace futuro */}
        CONALJUVE Bolivia
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3, // Padding vertical
        px: 2, // Padding horizontal
        mt: 'auto', // Empuja el footer hacia abajo
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body1" align="center" gutterBottom>
          Confederación Nacional de Juntas Vecinales de Bolivia
        </Typography>
        {/* Puedes añadir más enlaces o información aquí */}
        <Copyright />
      </Container>
    </Box>
  );
};

export default Footer;