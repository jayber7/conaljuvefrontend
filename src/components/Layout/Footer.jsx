// src/components/Layout/Footer.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Link, Grid, TextField, Button, IconButton, Stack, Divider } from '@mui/material';
// --- Importar iconos de redes sociales ---
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { FaTiktok } from 'react-icons/fa'; // Icono de TikTok desde react-icons

// --- IMPORTAR BANDERA (para fondo si la usas) ---
// import banderaBolivia from '../../assets/banderaCONALJUVE.png';
// --- ESTILOS REUTILIZABLES (Buena práctica) ---
const footerTitleStyle = {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '0.9rem', // Un poco más pequeño para footer
    mb: 1.5 // Margen inferior consistente
};

const footerLinkStyle = {
    color: 'inherit', // Hereda el gris claro del Box padre
    textDecoration: 'none',
    display: 'block',
    mb: 0.8, // Espacio entre links
    fontSize: '0.875rem', // body2
    '&:hover': {
        color: 'secondary.main', // Color de acento al pasar el mouse
        textDecoration: 'underline',
    }
};

const socialLinks = [ // Mejor como array de objetos
    { href: 'https://facebook.com/...', label: 'Facebook CONALJUVE', icon: <FacebookIcon /> },
    { href: 'https://wa.me/...', label: 'WhatsApp CONALJUVE', icon: <WhatsAppIcon /> },
    { href: 'https://instagram.com/...', label: 'Instagram CONALJUVE', icon: <InstagramIcon /> },
    // { href: 'https://tiktok.com/...', label: 'TikTok CONALJUVE', icon: <TikTokIcon /> },
];
// --- FIN ESTILOS ---


function Copyright() {
    return (
        <> {/* Usar Fragment para agrupar */}
            {'Copyright © '}
            <Link color="inherit" href="#">CONALJUVE Bolivia</Link>{' '}
            {new Date().getFullYear()}
            {'. Todos los derechos reservados.'}
            <br />
            <Link component={RouterLink} to="/politica-privacidad" color="inherit" sx={{ mx: 1, fontSize: '0.75rem' }}>
                Política de Privacidad
             </Link>
             {' | '}
             <Link component={RouterLink} to="/terminos-servicio" color="inherit" sx={{ mx: 1, fontSize: '0.75rem' }}>
                 Términos de Servicio
             </Link>
        </>
    );
}

const Footer = () => {
    
    return (
        <Box
            component="footer"
            sx={{
                py: { xs: 4, md: 6 }, // Más padding vertical en pantallas grandes
                px: { xs: 2, md: 3 },
                mt: 'auto',
                backgroundColor: '#222', // O theme.palette.grey[900]
                color: 'rgba(255, 255, 255, 0.7)',
                backgroundImage: `url('/assets/patterns/pattern.png')`,  // Si usas imagen
                backgroundRepeat: 'repeat',
                
            }}
        >
            <Container maxWidth="lg"  >
             {/* --- GRID RESPONSIVO --- */}
             <Grid container spacing={{ xs: 3, sm: 4, md: 5 }} justifyContent="space-between">
                    {/* --- Columna 1: Descubre / Quiénes Somos --- */}

                    <Grid xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={footerTitleStyle}>
                            Descubre
                        </Typography>
                        <Link component={RouterLink} to="/sobre-conaljuve" color="inherit" display="block" sx={footerLinkStyle}>¿Qué es CONALJUVE?</Link>
                        <Link component={RouterLink} to="/noticias" color="inherit" display="block" sx={footerLinkStyle}>Últimas Noticias</Link>
                        <Link href="#" color="inherit" display="block" sx={footerLinkStyle}>Federaciones</Link> {/* Enlace futuro */}
                        <Link href="#" color="inherit" display="block" sx={footerLinkStyle}>Contacto</Link> {/* Enlace futuro */}
                    </Grid>

                    {/* --- Columna 2: Soporte / Participa --- */}
                    <Grid xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={footerTitleStyle}>
                            Suscribete y danos a conocer tus inquietudes y necesidades CONALJUVE.
                            Se parte de nuestra comunidad.
                        </Typography>
                        <Link component={RouterLink} to="/registro" color="inherit" display="block" sx={footerLinkStyle}>Registrarse</Link>
                        <Link component={RouterLink} to="/login" color="inherit" display="block" sx={footerLinkStyle}>Iniciar Sesión</Link>
                        <Link href="#" color="inherit" display="block" sx={footerLinkStyle}>¿Cómo ser miembro?</Link> {/* Enlace futuro */}
                        <Link href="#" color="inherit" display="block" sx={footerLinkStyle}>Voluntariado</Link> {/* Enlace futuro */}
                    </Grid>

                    {/* --- Columna 3: Conecta / Redes Sociales --- */}
                    <Grid xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom sx={footerTitleStyle}>
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

                     

                </Grid>
                <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                {/* --- Copyright --- */}
                <Typography variant="body2" align="center" sx={{ mt: 5, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    {'Copyright © '}
                    <Link color="inherit" href="#">CONALJUVE Bolivia</Link>{' '}
                    <Copyright/>
                    {new Date().getFullYear()}
                    {'. Todos los derechos reservados.'}
                </Typography>
            </Container>
        </Box>
    );
};



export default Footer;