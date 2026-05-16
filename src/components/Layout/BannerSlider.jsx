import React from 'react';
import Slider from 'react-slick';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import GroupsIcon from '@mui/icons-material/Groups';
import CampaignIcon from '@mui/icons-material/Campaign';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const banners = [
    {
        id: 1,
        gradient: 'linear-gradient(135deg, #003366 0%, #004d99 50%, #0066cc 100%)',
        icon: <CampaignIcon sx={{ fontSize: 80 }} />,
        title: 'Bienvenidos a CONALJUVE',
        description: 'La Plataforma Digital de las Juntas Vecinales de Bolivia. Conectando comunidades, fortaleciendo la democracia participativa.',
        linkUrl: '/sobre-conaljuve',
        linkLabel: 'Conocer Más'
    },
    {
        id: 2,
        gradient: 'linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%)',
        icon: <HowToRegIcon sx={{ fontSize: 80 }} />,
        title: 'Regístrate como Miembro',
        description: 'Únete a la red más grande de juntas vecinales del país. Participa, opina y construye el futuro de tu comunidad.',
        linkUrl: '/registro-miembro',
        linkLabel: 'Registrarse Ahora'
    },
    {
        id: 3,
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)',
        icon: <GroupsIcon sx={{ fontSize: 80 }} />,
        title: 'Comité de Juventud',
        description: 'Formando líderes del mañana. Espacios de participación para jóvenes comprometidos con el desarrollo comunitario.',
        linkUrl: '/comites/juventud',
        linkLabel: 'Participa'
    },
    {
        id: 4,
        gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
        icon: <EmojiEventsIcon sx={{ fontSize: 80 }} />,
        title: '41 Aniversario CONALJUVE',
        description: 'Celebrando más de cuatro décadas de lucha y organización vecinal en Bolivia. ¡Únete a la celebración!',
        linkUrl: '/',
        linkLabel: 'Ver Más'
    },
    {
        id: 5,
        gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)',
        icon: <CampaignIcon sx={{ fontSize: 80 }} />,
        title: 'Proyectos Comunitarios',
        description: 'Impulsa proyectos que transforman tu barrio. Desde infraestructura hasta programas sociales para tu comunidad.',
        linkUrl: '/proyectos',
        linkLabel: 'Explorar Proyectos'
    },
];

const BannerSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        arrows: false,
        dotsClass: "slick-dots custom-dots",
        fade: true,
    };

    return (
        <Box sx={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
            <style>{`
                .custom-dots {
                    bottom: 20px;
                    z-index: 10;
                }
                .custom-dots li {
                    margin: 0 4px;
                }
                .custom-dots li button:before {
                    font-size: 10px;
                    color: rgba(255, 255, 255, 0.5);
                    opacity: 1;
                    transition: all 0.3s ease;
                }
                .custom-dots li.slick-active button:before {
                    color: #F59E0B;
                    font-size: 12px;
                }
                .custom-dots li button {
                    width: 10px;
                    height: 10px;
                }
            `}</style>
            <Slider {...settings}>
                {banners.map((banner) => (
                    <Box key={banner.id} sx={{ position: 'relative', width: '100%', height: { xs: '280px', sm: '350px', md: '420px' } }}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                background: banner.gradient,
                                zIndex: 1,
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                                zIndex: 2,
                            }}
                        />
                        <Box
                            sx={{
                                position: 'relative',
                                zIndex: 3,
                                color: 'white',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                                p: { xs: 2, md: 4 },
                            }}
                        >
                            <Box
                                sx={{
                                    mb: 3,
                                    opacity: 0.9,
                                    animation: 'float 3s ease-in-out infinite',
                                    '@keyframes float': {
                                        '0%, 100%': { transform: 'translateY(0)' },
                                        '50%': { transform: 'translateY(-10px)' },
                                    },
                                }}
                            >
                                {banner.icon}
                            </Box>
                            <Typography
                                variant="h2"
                                component="h2"
                                gutterBottom
                                sx={{
                                    fontWeight: 800,
                                    fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                                    letterSpacing: '-0.02em',
                                    mb: 2,
                                }}
                            >
                                {banner.title}
                            </Typography>
                            <Typography
                                variant="h6"
                                component="p"
                                sx={{
                                    mb: 4,
                                    maxWidth: '600px',
                                    fontWeight: 400,
                                    fontSize: { xs: '0.95rem', md: '1.1rem' },
                                    opacity: 0.95,
                                    lineHeight: 1.6,
                                    textShadow: '0 1px 4px rgba(0,0,0,0.2)',
                                }}
                            >
                                {banner.description}
                            </Typography>
                            {banner.linkUrl && banner.linkLabel && (
                                <Button
                                    variant="contained"
                                    component={RouterLink}
                                    to={banner.linkUrl}
                                    size="large"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        backdropFilter: 'blur(10px)',
                                        border: '2px solid rgba(255, 255, 255, 0.3)',
                                        color: '#ffffff',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        '&:hover': {
                                            background: '#ffffff',
                                            color: '#003366',
                                            borderColor: '#ffffff',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
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
