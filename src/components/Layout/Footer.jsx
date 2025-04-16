// src/components/Layout/Footer.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Link, Grid, TextField, Button, IconButton, Stack } from '@mui/material';
// --- Importar iconos de redes sociales ---
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { FaTiktok } from 'react-icons/fa'; // Icono de TikTok desde react-icons

// --- IMPORTAR BANDERA (para fondo si la usas) ---
// import banderaBolivia from '../../assets/banderaCONALJUVE.png';

const Footer = () => {
    const socialLinks = [
        { icon: <FacebookIcon />, href: 'https://www.facebook.com/p/Conaljuve-Bolivia-100082746362431/', 'aria-label': 'Facebook de CONALJUVE' },
        { icon: <InstagramIcon />, href: 'https://www.instagram.com/', 'aria-label': 'Instagram' }, // Reemplazar con enlace real si existe
        { icon: <FaTiktok size="1.5em"/>, href: 'https://www.tiktok.com/', 'aria-label': 'TikTok' }, // Reemplazar con enlace real si existe
        { icon: <WhatsAppIcon />, href: 'https://wa.me/NUMERO_WHATSAPP', 'aria-label': 'WhatsApp' }, // Reemplazar con enlace real
    ];

    return (
        <Box
            component="footer"
            sx={{
                py: 6, // Más padding
                px: 2,
                mt: 'auto',
                backgroundColor: '#222', // Fondo oscuro sólido
                color: 'rgba(255, 255, 255, 0.7)', // Texto blanco con ligera transparencia
                // --- Fondo con Bandera (OPCIONAL, si lo quieres) ---
                // backgroundImage: `url(${banderaBolivia})`,
                // backgroundSize: 'cover', // o 'contain' o 'auto' con repeat
                // backgroundPosition: 'center center',
                // backgroundRepeat: 'no-repeat', // o 'repeat'
                // position: 'relative',
                // '&::before': { /* Overlay si usas imagen de fondo */
                //      content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                //      backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 0,
                // },
                // '& > .MuiContainer-root': { position: 'relative', zIndex: 1}
                 // --- FIN Fondo Opcional ---
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="space-between">

                    {/* --- Columna 1: Descubre / Quiénes Somos --- */}
                    <Grid xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '1rem' }}>
                            Descubre
                        </Typography>
                        <Link component={RouterLink} to="/sobre-conaljuve" color="inherit" display="block" sx={footerLinkStyle}>¿Qué es CONALJUVE?</Link>
                        <Link component={RouterLink} to="/noticias" color="inherit" display="block" sx={footerLinkStyle}>Últimas Noticias</Link>
                        <Link href="#" color="inherit" display="block" sx={footerLinkStyle}>Federaciones</Link> {/* Enlace futuro */}
                        <Link href="#" color="inherit" display="block" sx={footerLinkStyle}>Contacto</Link> {/* Enlace futuro */}
                    </Grid>

                    {/* --- Columna 2: Soporte / Participa --- */}
                    <Grid xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '1rem' }}>
                            Suscribete y danos a conocer tus inquietudes y necesidades CONALJUVE.
                            Se parte de nuestra comunidad.
                        </Typography>
                        <Link component={RouterLink} to="/registro" color="inherit" display="block" sx={footerLinkStyle}>Registrarse</Link>
                        <Link component={RouterLink} to="/login" color="inherit" display="block" sx={footerLinkStyle}>Iniciar Sesión</Link>
                        <Link href="#" color="inherit" display="block" sx={footerLinkStyle}>¿Cómo afiliarse?</Link> {/* Enlace futuro */}
                        <Link href="#" color="inherit" display="block" sx={footerLinkStyle}>Voluntariado</Link> {/* Enlace futuro */}
                    </Grid>

                    {/* --- Columna 3: Conecta / Redes Sociales --- */}
                    <Grid xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '1rem' }}>
                            Conecta
                        </Typography>
                        <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
                            {socialLinks.map((social, index) => (
                                <IconButton
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social['aria-label']}
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                                    }}
                                >
                                    {social.icon}
                                </IconButton>
                            ))}
                        </Stack>
                        <Link href="#" color="inherit" display="block" sx={footerLinkStyle}>Oficinas Centrales</Link> {/* Enlace futuro */}
                        <Link href="#" color="inherit" display="block" sx={footerLinkStyle}>Directorio</Link> {/* Enlace futuro */}
                    </Grid>

                     {/* --- Columna 4: Suscripción (Opcional) o Login --- */}
                     <Grid xs={12} sm={6} md={3}>
                         <Typography variant="h6" gutterBottom sx={{ color: 'white', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '1rem' }}>
                            Acceso Miembros
                         </Typography>
                         <Button component={RouterLink} to="/login" variant="contained" color="secondary" fullWidth sx={{ mb: 1}}>
                             Iniciar Sesión
                         </Button>
                          <Button component={RouterLink} to="/registro" variant="outlined" fullWidth sx={{color: 'white', borderColor: 'rgba(255,255,255,0.5)', '&:hover': {borderColor: 'white'}}}>
                             Registrarse
                         </Button>
                         {/* Alternativa: Formulario de suscripción como WWF */}
                         {/* <Typography variant="body2" sx={{mb:1}}>Recibe las últimas noticias:</Typography>
                         <TextField variant="filled" size="small" label="Correo Electrónico" fullWidth sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 1, input: { color: 'white'} }}/>
                         <Button variant="contained" color="secondary" fullWidth>Suscribirse</Button> */}
                     </Grid>

                </Grid>

                {/* --- Copyright --- */}
                <Typography variant="body2" align="center" sx={{ mt: 5, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    {'Copyright © '}
                    <Link color="inherit" href="#">CONALJUVE Bolivia</Link>{' '}
                    {new Date().getFullYear()}
                    {'. Todos los derechos reservados.'}
                </Typography>
            </Container>
        </Box>
    );
};

// Estilo reutilizable para enlaces del footer
const footerLinkStyle = {
    mb: 0.8, // Margen inferior
    textDecoration: 'none',
    '&:hover': {
        color: 'white', // Texto blanco al pasar el mouse
        textDecoration: 'underline',
    }
};


export default Footer;