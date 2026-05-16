import { createTheme } from '@mui/material/styles';
import { red, blueGrey, grey, amber, green, blue, deepPurple } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003366',
      light: '#004d99',
      dark: '#002244',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      contrastText: '#1a1a2e',
    },
    accent: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    error: { main: red.A400 },
    background: {
      default: '#F8FAFC',
      paper: '#ffffff',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #003366 0%, #004d99 100%)',
      secondary: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      hero: 'linear-gradient(135deg, #003366 0%, #004d99 50%, #0066cc 100%)',
      card1: 'linear-gradient(135deg, #003366 0%, #004d99 100%)',
      card2: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      card3: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      card4: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: '#0F172A',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: '#0F172A',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#1E293B',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#1E293B',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#334155',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#64748B',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 500,
      color: '#94A3B8',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.01em',
    },
  },

  shape: {
    borderRadius: 12,
  },

  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    ...Array(19).fill('none'),
  ],

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #E2E8F0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-4px)',
            borderColor: 'transparent',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: 'none',
          padding: '10px 24px',
          fontWeight: 600,
          fontSize: '0.95rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #003366 0%, #004d99 100%)',
          boxShadow: '0 4px 6px -1px rgba(0, 51, 102, 0.3)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 51, 102, 0.4)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
          color: '#1a1a2e',
          boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.3)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.4)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 20,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: '#E2E8F0',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid',
        },
        standardWarning: {
          backgroundColor: '#FFFBEB',
          borderColor: '#FDE68A',
          color: '#92400E',
          '& .MuiAlert-icon': { color: '#F59E0B' },
        },
        standardError: {
          backgroundColor: '#FEF2F2',
          borderColor: '#FECACA',
          color: '#991B1B',
        },
        standardSuccess: {
          backgroundColor: '#F0FDF4',
          borderColor: '#BBF7D0',
          color: '#166534',
        },
        standardInfo: {
          backgroundColor: '#EFF6FF',
          borderColor: '#BFDBFE',
          color: '#1E40AF',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          paddingTop: 8,
          paddingBottom: 8,
          minHeight: 'auto',
          fontSize: '0.9rem',
          borderRadius: 8,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 51, 102, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(0, 51, 102, 0.12)',
            },
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        body {
          background-color: #F8FAFC;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        ::selection {
          background-color: rgba(0, 51, 102, 0.2);
          color: #003366;
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: #CBD5E1 #F1F5F9;
        }
        
        *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        *::-webkit-scrollbar-track {
          background: #F1F5F9;
          border-radius: 4px;
        }
        
        *::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `,
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
