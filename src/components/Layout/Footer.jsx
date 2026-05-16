import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Link, Grid, IconButton, Stack, Divider } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TikTokIcon from '@mui/icons-material/MusicNote';

const socialLinks = [
    { href: 'https://facebook.com/conaljuve', label: 'Facebook CONALJUVE', icon: <FacebookIcon /> },
    { href: 'https://wa.me/591', label: 'WhatsApp CONALJUVE', icon: <WhatsAppIcon /> },
    { href: 'https://instagram.com/conaljuve', label: 'Instagram CONALJUVE', icon: <InstagramIcon /> },
    { href: 'https://tiktok.com/@conaljuve', label: 'TikTok CONALJUVE', icon: <TikTokIcon /> },
];

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: { xs: 5, md: 7 },
                px: { xs: 2, md: 3 },
                mt: 'auto',
                background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
                color: 'rgba(255, 255, 255, 0.7)',
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 4, md: 5 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, mb: 2, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Descubre
                        </Typography>
                        <Link component={RouterLink} to="/sobre-conaljuve" color="inherit" display="block" sx={{ mb: 1, fontSize: '0.9rem', '&:hover': { color: '#F59E0B' }, transition: 'color 0.2s' }}>
                            ¿Qué es CONALJUVE?
                        </Link>
                        <Link component={RouterLink} to="/" color="inherit" display="block" sx={{ mb: 1, fontSize: '0.9rem', '&:hover': { color: '#F59E0B' }, transition: 'color 0.2s' }}>
                            Últimas Noticias
                        </Link>
                        <Link component={RouterLink} to="/institucion/organigrama" color="inherit" display="block" sx={{ mb: 1, fontSize: '0.9rem', '&:hover': { color: '#F59E0B' }, transition: 'color 0.2s' }}>
                            Comité Ejecutivo
                        </Link>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, mb: 2, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Participa
                        </Typography>
                        <Link component={RouterLink} to="/registro-miembro" color="inherit" display="block" sx={{ mb: 1, fontSize: '0.9rem', '&:hover': { color: '#F59E0B' }, transition: 'color 0.2s' }}>
                            Registrarse
                        </Link>
                        <Link component={RouterLink} to="/como-ser-miembro" color="inherit" display="block" sx={{ mb: 1, fontSize: '0.9rem', '&:hover': { color: '#F59E0B' }, transition: 'color 0.2s' }}>
                            ¿Cómo ser miembro?
                        </Link>
                        <Link component={RouterLink} to="/proyectos" color="inherit" display="block" sx={{ mb: 1, fontSize: '0.9rem', '&:hover': { color: '#F59E0B' }, transition: 'color 0.2s' }}>
                            Proyectos
                        </Link>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, mb: 2, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Conecta
                        </Typography>
                        <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                            {socialLinks.map((social, index) => (
                                <IconButton
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                                        '&:hover': {
                                            color: '#ffffff',
                                            bgcolor: 'rgba(245, 158, 11, 0.2)',
                                        },
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {social.icon}
                                </IconButton>
                            ))}
                        </Stack>
                        <Link component={RouterLink} to="/contacto" color="inherit" display="block" sx={{ mb: 1, fontSize: '0.9rem', '&:hover': { color: '#F59E0B' }, transition: 'color 0.2s' }}>
                            Contacto
                        </Link>
                        <Link component={RouterLink} to="/tribunales" color="inherit" display="block" sx={{ mb: 1, fontSize: '0.9rem', '&:hover': { color: '#F59E0B' }, transition: 'color 0.2s' }}>
                            Tribunales
                        </Link>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, mb: 2, fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Legal
                        </Typography>
                        <Link component={RouterLink} to="/politica-privacidad" color="inherit" display="block" sx={{ mb: 1, fontSize: '0.9rem', '&:hover': { color: '#F59E0B' }, transition: 'color 0.2s' }}>
                            Política de Privacidad
                        </Link>
                        <Link component={RouterLink} to="/terminos-servicio" color="inherit" display="block" sx={{ mb: 1, fontSize: '0.9rem', '&:hover': { color: '#F59E0B' }, transition: 'color 0.2s' }}>
                            Términos de Servicio
                        </Link>
                        <Link component={RouterLink} to="/institucion/estatuto" color="inherit" display="block" sx={{ mb: 1, fontSize: '0.9rem', '&:hover': { color: '#F59E0B' }, transition: 'color 0.2s' }}>
                            Estatuto Orgánico
                        </Link>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', opacity: 0.7 }}>
                        {'Copyright © '}
                        <Link color="inherit" component={RouterLink} to="/" sx={{ fontWeight: 600 }}>
                            CONALJUVE Bolivia
                        </Link>
                        {' '}
                        {new Date().getFullYear()}
                        {'. Todos los derechos reservados.'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', opacity: 0.5 }}>
                        Plataforma Digital de las Juntas Vecinales de Bolivia
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
