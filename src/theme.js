// src/theme.js
import { createTheme } from '@mui/material/styles';
import { red, blueGrey, grey } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#004080', // Azul corporativo CONALJUVE (ejemplo)
      // light: '#336699',
      // dark: '#002d5a',
    },
    secondary: {
      main: '#ffc107', // Amarillo/Naranja como acento (inspirado bandera Bolivia)
      // main: '#d32f2f', // Rojo como acento alternativo
    },
    error: {
      main: red.A400,
    },
    background: {
      default: grey[100], // Fondo muy claro, casi blanco
      paper: '#ffffff', // Fondo de elementos como Cards, Modals
    },
    text: {
        primary: blueGrey[900],
        secondary: blueGrey[600],
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.8rem', fontWeight: 500, marginBottom: '1rem', color: '#002d5a' },
    h2: { fontSize: '2.2rem', fontWeight: 500, marginBottom: '0.8rem', color: '#003f7a'},
    h3: { fontSize: '1.8rem', fontWeight: 500, marginBottom: '0.7rem' },
    h4: { fontSize: '1.5rem', fontWeight: 500, marginBottom: '0.6rem' },
    // ... otras personalizaciones
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          // Sombra sutil
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
            // transform: 'translateY(-2px)', // Efecto sutil al pasar el mouse
          },
        }
      }
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: '20px', // Botones más redondeados
                textTransform: 'none', // Evitar mayúsculas por defecto
                padding: '8px 20px',
            },
            containedPrimary: { // Estilo botón primario
               color: '#ffffff',
            },
        }
    },
    MuiDialog: { // Estilo para modales
        styleOverrides: {
            paper: {
                borderRadius: '12px',
            }
        }
    }
  },
});

export default theme;