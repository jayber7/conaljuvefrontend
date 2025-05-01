// src/pages/PrivacyPolicyPage.jsx
import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Link } from '@mui/material';

const PrivacyPolicyPage = () => {
  const appName = "Portal CONALJUVE"; // Nombre de tu aplicación
  const orgName = "Confederación Nacional de Juntas Vecinales de Bolivia (CONALJUVE)";
  const contactEmail = "privacidad@conaljuve.org.bo"; // Reemplaza con un email real
  const lastUpdated = "15 de Mayo de 2024"; // Actualiza la fecha

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h1" component="h1" gutterBottom>
        Política de Privacidad de {appName}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Última actualización: {lastUpdated}
      </Typography>

      <Box sx={{ my: 3 }}>
        <Typography paragraph>
          Bienvenido a {appName}, la plataforma oficial de la {orgName}. Nos comprometemos a proteger tu privacidad y a ser transparentes sobre cómo recopilamos, usamos y protegemos tu información personal. Esta Política de Privacidad explica nuestras prácticas. Al usar nuestro portal, aceptas las prácticas descritas en esta política.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>1. Información que Recopilamos</Typography>
        <Typography paragraph>Recopilamos diferentes tipos de información para proporcionar y mejorar nuestro servicio:</Typography>
        <List dense>
          <ListItem>
            <ListItemText
              primary="a. Información proporcionada por ti:"
              secondary={
                <>
                  Cuando te registras (por ejemplo, a través de Facebook Login) y completas tu perfil, podemos recopilar:
                  <List dense disablePadding sx={{ pl: 2 }}>
                     <ListItem sx={{ py: 0.2 }}><ListItemText primary="Nombre completo" /></ListItem>
                     <ListItem sx={{ py: 0.2 }}><ListItemText primary="Correo electrónico" /></ListItem>
                     <ListItem sx={{ py: 0.2 }}><ListItemText primary="ID de Facebook (si usas Facebook Login)" /></ListItem>
                     <ListItem sx={{ py: 0.2 }}><ListItemText primary="URL de foto de perfil (proporcionada por Facebook o subida por ti)" /></ListItem>
                     <ListItem sx={{ py: 0.2 }}><ListItemText primary="Información de ubicación (Departamento, Provincia, Municipio, Zona)" /></ListItem>
                     <ListItem sx={{ py: 0.2 }}><ListItemText primary="Fecha de Nacimiento (opcional)" /></ListItem>
                     <ListItem sx={{ py: 0.2 }}><ListItemText primary="Género (opcional)" /></ListItem>
                     <ListItem sx={{ py: 0.2 }}><ListItemText primary="Número de Carnet de Identidad y Extensión (opcional)" /></ListItem>
                     <ListItem sx={{ py: 0.2 }}><ListItemText primary="Número de Teléfono (opcional)" /></ListItem>
                     <ListItem sx={{ py: 0.2 }}><ListItemText primary="Comentarios y otras interacciones que publiques." /></ListItem>
                  </List>
                </>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="b. Información recopilada automáticamente:"
              secondary="Podemos recopilar información sobre tu dispositivo y uso del portal, como dirección IP, tipo de navegador, páginas visitadas, tiempo de visita, a través de cookies y tecnologías similares para mejorar el servicio y analizar el uso. (Sé más específico aquí si usas Analytics u otras herramientas)."
             />
          </ListItem>
        </List>
      </Box>

       <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>2. Cómo Usamos tu Información</Typography>
         <Typography paragraph>Utilizamos la información recopilada para:</Typography>
         <List dense>
             <ListItem><ListItemText primary="- Proveer, operar y mantener nuestro portal." /></ListItem>
             <ListItem><ListItemText primary="- Gestionar tu cuenta y permitir tu participación (ej. comentar)." /></ListItem>
             <ListItem><ListItemText primary="- Personalizar y mejorar tu experiencia." /></ListItem>
             <ListItem><ListItemText primary="- Comunicarnos contigo (notificaciones importantes, respuesta a consultas)." /></ListItem>
             <ListItem><ListItemText primary="- (Opcional: si envías newsletters) Enviarte noticias, información sobre eventos o comunicados relevantes de CONALJUVE, si has dado tu consentimiento." /></ListItem>
             <ListItem><ListItemText primary="- Analizar el uso del portal para mejorar nuestros servicios." /></ListItem>
             <ListItem><ListItemText primary="- Cumplir con obligaciones legales y proteger nuestros derechos." /></ListItem>
             <ListItem><ListItemText primary="- Mostrar información relevante basada en tu ubicación (ej. noticias departamentales) sin compartir tu ubicación exacta sin permiso."/></ListItem>
         </List>
      </Box>

       <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>3. Uso de Datos de Facebook</Typography>
         <Typography paragraph>
            Si eliges iniciar sesión con Facebook, solicitaremos permiso para acceder a tu información básica de perfil público, nombre, correo electrónico y foto de perfil. Utilizamos esta información únicamente para:
         </Typography>
          <List dense>
             <ListItem><ListItemText primary="- Crear o vincular tu cuenta en nuestro portal." /></ListItem>
             <ListItem><ListItemText primary="- Autenticarte de forma segura." /></ListItem>
             <ListItem><ListItemText primary="- Pre-rellenar tu nombre y mostrar tu foto de perfil en nuestro portal."/></ListItem>
         </List>
         <Typography paragraph>
             No publicaremos en tu perfil de Facebook sin tu permiso explícito. Puedes gestionar los permisos de la aplicación en la configuración de tu cuenta de Facebook.
         </Typography>
      </Box>

       <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>4. Cómo Compartimos tu Información</Typography>
         <Typography paragraph>
             No vendemos ni alquilamos tu información personal. Podemos compartir tu información en circunstancias limitadas:
         </Typography>
         <List dense>
             <ListItem><ListItemText primary="- **Proveedores de Servicios:** Con terceros que nos ayudan a operar el portal (ej. alojamiento web, almacenamiento en la nube como Cloudinary, análisis, envío de emails), quienes están obligados a proteger tu información." /></ListItem>
             <ListItem><ListItemText primary="- **Requerimientos Legales:** Si es requerido por ley, proceso legal o solicitud gubernamental." /></ListItem>
             <ListItem><ListItemText primary="- **Protección de Derechos:** Para proteger los derechos, propiedad o seguridad de {orgName}, nuestros usuarios u otros." /></ListItem>
              <ListItem><ListItemText primary="- **Información Pública:** Tu nombre de usuario y los comentarios que publiques serán visibles para otros usuarios del portal." /></ListItem>
         </List>
      </Box>

       <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>5. Seguridad de la Información</Typography>
         <Typography paragraph>
             Implementamos medidas de seguridad razonables (técnicas y organizativas) para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción. Sin embargo, ninguna transmisión por Internet o almacenamiento electrónico es 100% seguro.
         </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>6. Tus Derechos</Typography>
        <Typography paragraph>
            Tienes derecho a acceder, corregir, actualizar o solicitar la eliminación de tu información personal. Puedes gestionar parte de tu información a través de la configuración de tu perfil (si implementas una página de perfil editable). Para otras solicitudes o si tienes preguntas, contáctanos en <Link href={`mailto:${contactEmail}`}>{contactEmail}</Link>.
            {(false) && // Condición si implementas opción de baja de newsletter
             <Typography paragraph>Si te suscribes a nuestras comunicaciones por correo, puedes optar por no recibirlas siguiendo las instrucciones de cancelación de suscripción incluidas en cada correo.</Typography>
             }
        </Typography>
      </Box>

       <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>7. Retención de Datos</Typography>
         <Typography paragraph>
            Conservaremos tu información personal durante el tiempo que sea necesario para cumplir con los fines descritos in esta política, a menos que la ley exija o permita un período de retención más largo.
         </Typography>
      </Box>

       <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>8. Privacidad de Menores</Typography>
         <Typography paragraph>
            Nuestro portal no está dirigido a menores de 13 años (o la edad mínima aplicable en tu jurisdicción). No recopilamos intencionalmente información de menores sin el consentimiento paterno. Si crees que hemos recopilado información de un menor, contáctanos.
         </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>9. Cambios a esta Política</Typography>
        <Typography paragraph>
            Podemos actualizar esta Política de Privacidad periódicamente. Te notificaremos de cualquier cambio publicando la nueva política en esta página y actualizando la fecha de "Última actualización". Te recomendamos revisar esta política regularmente.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h4" component="h2" gutterBottom>10. Contacto</Typography>
        <Typography paragraph>
            Si tienes alguna pregunta sobre esta Política de Privacidad, por favor contáctanos en: <Link href={`mailto:${contactEmail}`}>{contactEmail} </Link> Dirección: calle 16 de Julio casi La Paz
        </Typography>
      </Box>

    </Container>
  );
};

export default PrivacyPolicyPage;