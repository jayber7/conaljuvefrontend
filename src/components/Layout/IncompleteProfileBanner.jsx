// src/components/Layout/IncompleteProfileBanner.jsx
import React from 'react';
import { Alert, AlertTitle, Button, Container, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

// Recibe la función para abrir el modal como prop
const IncompleteProfileBanner = ({ onOpenProfileModal }) => {
  return (
    // Usar un Box para controlar el margen si es necesario, o aplicar a Alert
    <Box sx={{ py: 1, bgcolor: 'warning.light' }}>
      <Container maxWidth="lg">
        <Alert
          severity="warning"
          icon={<InfoIcon fontSize="inherit" />}
          action={
            <Button
              color="inherit" // Hereda color del texto de alerta
              size="small"
              variant="outlined" // Botón más destacado
              onClick={onOpenProfileModal} // Llama a la función del padre
              sx={{ ml: 2, whiteSpace: 'nowrap' }} // Margen y evitar salto de línea
            >
              Completar Perfil
            </Button>
          }
          sx={{
              alignItems: 'center', // Centrar verticalmente el contenido y la acción
              border: 'none', // Quitar borde por defecto si se usa dentro de Box con fondo
              bgcolor: 'transparent', // Hacer fondo transparente si Box ya tiene color
              '.MuiAlert-message': { // Ajustar estilos del mensaje si es necesario
                  flexGrow: 1, // Permitir que el mensaje ocupe espacio
              }
          }}
        >
          {/* <AlertTitle>Perfil Incompleto</AlertTitle> */}
          ¡Bienvenido! Para acceder a todas las funciones y recursos para miembros, por favor completa tu información de perfil.
        </Alert>
      </Container>
    </Box>
  );
};

export default IncompleteProfileBanner;