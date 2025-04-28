// src/components/Layout/BannerSlider.stories.jsx

import React from 'react';
import BannerSlider from './BannerSlider'; // Ajusta la ruta a tu componente
import { Box } from '@mui/material';

// Configuración básica
export default {
  title: 'Components/Layout/BannerSlider', // Nombre en la barra lateral de Storybook
  component: BannerSlider,
  parameters: {
    // Opcional: layout 'fullscreen' puede ser mejor para un banner ancho
    layout: 'fullscreen',
    // Opcional: Añadir un fondo oscuro si el texto del banner es blanco
    // background: { default: 'dark' }
  },
  // No necesitamos controles (args/argTypes) aquí si el componente
  // no recibe props externas significativas para su estructura básica.
  // Los datos de los banners están dentro del componente por ahora.
};

// --- Historia Principal ---
// Simplemente renderiza el componente
const Template = (args) => (
    // Añadir un contenedor si es necesario para limitar ancho en Storybook
    // o dejar que ocupe todo si layout es 'fullscreen'
    <Box sx={{ /* maxWidth: '1200px', margin: 'auto' */ }}>
         <BannerSlider {...args} />
    </Box>
);

export const Default = Template.bind({});
Default.args = {
  // No se necesitan args si los banners están hardcodeados dentro
};
Default.storyName = 'Default Slider'; // Nombre de la historia específica

// --- Historias Adicionales (Opcional) ---

// Podrías crear historias que pasen diferentes arrays de banners como props
// si refactorizas BannerSlider para aceptar los banners desde fuera.
/*
const bannersCortos = [ banner1 ];
export const SingleBanner = Template.bind({});
SingleBanner.args = {
    banners: bannersCortos // Necesitarías modificar BannerSlider para aceptar esta prop
};
SingleBanner.storyName = 'Con un solo Banner';

const bannersSinLink = [ banner1, { ...banner2, linkUrl: null, linkLabel: null } ];
export const WithoutLinks = Template.bind({});
WithoutLinks.args = {
    banners: bannersSinLink
};
WithoutLinks.storyName = 'Banners sin Enlace';
*/