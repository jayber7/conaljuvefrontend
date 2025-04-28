// src/components/Layout/BannerSlider.jsx
import React from 'react';
import Slider from 'react-slick'; // Importar Slider
import { Box, Typography, Button, Link, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom'; // Para enlaces internos

// --- DATOS DE EJEMPLO ---
// Reemplaza con tus imágenes y enlaces reales. Las imágenes pueden estar en public/assets/banners/
const banners = [
    {
        id: 1,
        imageUrl: '/assets/banners/banner1.jpg', // Ruta relativa a la carpeta public
        altText: 'Banner sobre nueva directiva',
        title: 'CONALJUVE Renueva su Directiva Nacional',
        description: 'Conoce a los nuevos líderes y los desafíos para la gestión.',
        linkUrl: '/comites/juventud', // Enlace a una noticia específica (ejemplo)
        linkLabel: 'Leer Más'
    },
    {
        id: 2,
        imageUrl: '/assets/banners/banner2.jpg',
        altText: 'Banner sobre seguridad ciudadana',
        title: 'Juntas Vecinales Exigen Mayor Seguridad',
        description: 'Reuniones clave con autoridades locales en Cochabamba.',
        linkUrl: '/comites/aliados',
        linkLabel: 'Ver Detalles'
    },
     {
        id: 3,
        imageUrl: '/assets/banners/banner3.jpg',
        altText: 'Banner sobre proyectos vecinales',
        title: 'Capacitación en Gestión de Proyectos',
        description: 'Fortaleciendo las capacidades de nuestros dirigentes.',
        linkUrl: '/comites/profesionales', // Enlace a una página de comité
        linkLabel: 'Más Información'
    },
    {
        id: 4,
        imageUrl: '/assets/banners/banner4.jpg',
        altText: 'Banner sobre proyectos vecinales',
        title: 'Capacitación en Gestión de Proyectos',
        description: 'Fortaleciendo las capacidades de nuestros dirigentes.',
        linkUrl: '/comites/salud', // Enlace a una página de comité
        linkLabel: 'Más Información'
    },
    // Añade hasta 8 banners
];
// --- FIN DATOS EJEMPLO ---


const BannerSlider = () => {

    // --- Configuración de React Slick ---
    const settings = {
        dots: true, // Muestra los puntos de navegación inferiores
        infinite: true, // Loop infinito
        speed: 500, // Velocidad de transición (ms)
        slidesToShow: 1, // Mostrar 1 slide a la vez
        slidesToScroll: 1, // Pasar 1 slide a la vez
        autoplay: true, // Reproducción automática
        autoplaySpeed: 5000, // Tiempo entre slides (ms)
        pauseOnHover: true, // Pausar al pasar el ratón
        arrows: false, // Ocultar flechas de navegación (opcional)
        dotsClass: "slick-dots custom-dots", // Clase CSS para personalizar puntos
        fade: true, // Efecto de desvanecimiento en lugar de slide (opcional)
    };
    // --- Fin Configuración ---

    return (
        // Contenedor principal del Slider
         // Añadir key al Box si da warning de unique key prop
        <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative', mb: 0 }}> {/* mb: 0 para quitar margen inferior si no se necesita */}
             {/* Estilos personalizados para los puntos */}
             <style>{`
                .custom-dots {
                    bottom: 15px; /* Posición vertical */
                }
                .custom-dots li button:before {
                    font-size: 10px; /* Tamaño puntos */
                    color: white; /* Color puntos inactivos */
                    opacity: 0.5;
                }
                .custom-dots li.slick-active button:before {
                    color: yellow; /* Color punto activo */
                    opacity: 0.9;
                }
             `}</style>
            <Slider {...settings}>
                {banners.map((banner) => (
                    <Box key={banner.id} sx={{ position: 'relative', width: '100%', height: { xs: '30vh', sm: '40vh', md: '50vh' }, maxHeight: '450px' }}> {/* Altura responsiva */}
                        {/* Imagen de fondo */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                backgroundImage: `url(${banner.imageUrl})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center center',
                                zIndex: -1,
                            }}
                        />
                         {/* Overlay oscuro para legibilidad */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Ajusta opacidad
                                zIndex: -2,
                            }}
                        />
                        {/* Contenido del Banner (Texto y Botón) */}
                        <Box
                            sx={{
                                position: 'relative', // Sobre el overlay
                                zIndex: 3,
                                color: 'white',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center', // Centrar verticalmente
                                alignItems: 'center', // Centrar horizontalmente
                                textAlign: 'center',
                                p: { xs: 2, md: 4 } // Padding interno
                            }}
                        >
                            <Typography variant="h2" component="h2" gutterBottom sx={{ fontWeight: 'bold', textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
                                {banner.title}
                            </Typography>
                            <Typography variant="h5" component="p" sx={{ mb: 3, maxWidth: '700px', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                                {banner.description}
                            </Typography>
                            {banner.linkUrl && banner.linkLabel && (
                                <Button
                                    variant="contained"
                                    color="secondary" // Usar color secundario para destacar
                                    component={RouterLink} // Usar RouterLink para navegación interna
                                    to={banner.linkUrl}
                                    size="large"
                                    sx={{ color: 'primary.dark', fontWeight: 'bold' }}
                                >
                                    {banner.linkLabel}
                                </Button>
                            )}
                        </Box>
                    </Box>
                ))}
            </Slider>
        </Box>
    );
};

export default BannerSlider;