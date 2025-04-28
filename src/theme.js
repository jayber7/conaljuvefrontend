// src/theme.js
import { createTheme } from '@mui/material/styles';
import { red, blueGrey, grey, amber  } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: { main: '#003366' },
    secondary: { main: amber[600] },
    error: { main: red.A400 },
    background: { default: grey[100], paper: '#ffffff' },
    text: { primary: blueGrey[900], secondary: grey[700], }
  },
  
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 600, marginBottom: '1rem', color: 'primary.dark' }, // Más oscuro y pesado
    h2: { fontSize: '2rem', fontWeight: 600, marginBottom: '0.8rem', color: 'primary.dark' },
    h3: { fontSize: '1.7rem', fontWeight: 500, marginBottom: '0.7rem' },
    h4: { fontSize: '1.4rem', fontWeight: 500, marginBottom: '0.6rem' },
    h5: { fontSize: '1.2rem', fontWeight: 500, marginBottom: '0.5rem' }, // Para títulos de Card
    h6: { fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }, // Para títulos de sección footer/forms
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    caption: { fontSize: '0.75rem', color: 'text.secondary' }, // Para fechas, metadatos
    button: { textTransform: 'none', fontWeight: 600 } // Botones sin mayúsculas, negrita
  },
    shape: {
    borderRadius: 8, // Bordes ligeramente redondeados por defecto
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
      defaultProps: {
        elevation: 1, // Sombra muy sutil por defecto
      },
      styleOverrides: {
        root: {
          borderRadius: (theme) => theme.shape.borderRadius, 
          transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out',
          '&:hover': {
             boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Sombra más definida al pasar
             // transform: 'translateY(-2px)', // Efecto opcional
          },
        }
      }
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: '20px', // Botones más redondeados
                textTransform: 'none', // Evitar mayúsculas por defecto
                padding: '6px 16px',
            },
            containedPrimary: { // Estilo botón primario
               color: 'rgba(0, 0, 0, 0.87)', // Texto oscuro para fondo amarillo
            },
        }
    },
    MuiDialog: { // Estilo para modales
        styleOverrides: {
            paper: {
                borderRadius: '12px',
            }
        }
    },
    MuiPaper: { // Estilo base para Paper (usado en modales, secciones)
      defaultProps: {
          elevation: 0, // Sin sombra por defecto (la añadimos donde sea necesario)
          variant: 'outlined', // Usar borde sutil por defecto
      },
      styleOverrides: {
          root: {
               borderColor: grey[300], // Color del borde sutil
          }
      }
   },
   MuiAlert: { // Mejorar apariencia de Alertas
       styleOverrides: {
           root: {
               borderRadius: (theme) => theme.shape.borderRadius,
           },
           standardWarning: { // Específico para el banner de perfil
               backgroundColor: amber[100], // Fondo amarillo pálido
               color: amber[900], // Texto oscuro
               '& .MuiAlert-icon': { color: amber[700] }, // Icono más oscuro
               '& .MuiButton-root': { // Estilo botón dentro de alerta warning
                  color: amber[900],
                  borderColor: amber[400],
                  '&:hover': {
                       backgroundColor: amber[200],
                       borderColor: amber[600],
                  }
               }
           }
       }
   },
    // --- AÑADIR ESTILOS GLOBALES PARA MenuItem ---
    MuiMenuItem: {
      styleOverrides: {
        root: { // Aplicar al elemento raíz del MenuItem
          paddingTop: 4, // Valor en píxeles (o theme.spacing(0.5))
          paddingBottom: 4, // Valor en píxeles (o theme.spacing(0.5))
          minHeight: 'auto', // Quitar altura mínima por defecto si interfiere
          // Opcional: ajustar tamaño de fuente global para items de menú
          fontSize: '0.9rem',
        },
      },
      // También puedes definir variantes 'dense' si MUI las soporta para MenuItem
      // variants: [
      //   {
      //     props: { dense: true },
      //     style: { paddingTop: 2, paddingBottom: 2 },
      //   },
      // ],
    },
    MuiCssBaseline: {
      styleOverrides: `
          body {
            background-color: ''${grey[200]}''; // Color de fondo base del tema
            //background-image: url('/assets/patterns/pattern.png');            
            //background-repeat: repeat;
            // Asegúrate de que el color de fondo base se vea si la imagen no carga
          }
          // ... otros estilos globales ...
      `,
    },
  },
});

export default theme;