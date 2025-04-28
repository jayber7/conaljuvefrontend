// .storybook/preview.jsx (Ejemplo para debuggear)
import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import theme from '../src/theme';
import { AuthProvider } from '../src/contexts/AuthContext';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
   // Comenta los decoradores temporalmente
  decorators: [
    (Story) => (
      <BrowserRouter>
         <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
               <Story />
            </AuthProvider>
         </ThemeProvider>
      </BrowserRouter>
    ),
  ],
};

export default preview;