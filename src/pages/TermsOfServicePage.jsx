// src/pages/TermsOfServicePage.jsx
import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, Link } from '@mui/material';

const TermsOfServicePage = () => {
    const appName = "Portal CONALJUVE";
    const orgName = "Confederación Nacional de Juntas Vecinales de Bolivia (CONALJUVE)";
    const contactEmail = "contacto@conaljuve.org.bo"; // Email de contacto general
    const lastUpdated = "15 de Mayo de 2024";

  return (
     <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h1" component="h1" gutterBottom>
        Términos de Servicio de {appName}
      </Typography>
       <Typography variant="body2" color="text.secondary" gutterBottom>
        Última actualización: {lastUpdated}
      </Typography>

      <Box sx={{ my: 3 }}>
        <Typography paragraph>
            Bienvenido al {appName}. Estos Términos de Servicio ("Términos") rigen tu acceso y uso del portal web y los servicios ofrecidos por la {orgName} ("nosotros", "nuestro"). Por favor, lee estos Términos cuidadosamente. Al acceder o usar el portal, aceptas estar vinculado por estos Términos y nuestra Política de Privacidad. Si no estás de acuerdo, no uses el portal.
        </Typography>
      </Box>

       <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>1. Uso del Portal</Typography>
        <Typography paragraph>
            Te otorgamos una licencia limitada, no exclusiva, no transferible y revocable para usar el portal para fines informativos y de participación comunitaria, de acuerdo con estos Términos.
        </Typography>
         <Typography paragraph>Te comprometes a no usar el portal para:</Typography>
         <List dense>
             <ListItem><ListItemText primary="- Cualquier propósito ilegal o no autorizado." /></ListItem>
             <ListItem><ListItemText primary="- Publicar contenido que sea difamatorio, obsceno, ofensivo, odioso, inflamatorio o que viole los derechos de otros." /></ListItem>
             <ListItem><ListItemText primary="- Acosar, abusar, insultar, dañar, difamar, calumniar, menospreciar, intimidar o discriminar por motivos de género, orientación sexual, religión, etnia, raza, edad, nacionalidad o discapacidad." /></ListItem>
             <ListItem><ListItemText primary="- Transmitir virus, spam o cualquier código de naturaleza destructiva." /></ListItem>
             <ListItem><ListItemText primary="- Intentar obtener acceso no autorizado a nuestras sistemas o cuentas de otros usuarios." /></ListItem>
         </List>
      </Box>

       <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>2. Cuentas de Usuario</Typography>
         <Typography paragraph>
             Para acceder a ciertas funciones, como comentar, necesitarás registrarte (ej. usando Facebook Login) y potencialmente completar tu perfil. Eres responsable de mantener la confidencialidad de tu cuenta (si aplica, como el acceso a tu cuenta de Facebook vinculada) y de todas las actividades que ocurran bajo tu cuenta. Aceptas notificar inmediatamente cualquier uso no autorizado.
         </Typography>
         <Typography paragraph>
             Debes proporcionar información precisa y completa al registrarte y mantenerla actualizada. Nos reservamos el derecho de suspender o cancelar tu cuenta si la información proporcionada es falsa, inexacta o viola estos Términos.
         </Typography>
      </Box>

       <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>3. Contenido del Usuario</Typography>
         <Typography paragraph>
             Eres el único responsable del contenido que publicas en el portal, incluyendo comentarios. Al publicar contenido, otorgas a {orgName} una licencia mundial, no exclusiva, libre de regalías, transferible y sublicenciable para usar, reproducir, distribuir, preparar trabajos derivados, mostrar y ejecutar ese contenido en conexión con el portal y los propósitos de la organización.
         </Typography>
          <Typography paragraph>
             Nos reservamos el derecho, pero no la obligación, de monitorear, editar o eliminar contenido que consideremos, a nuestra entera discreción, ilegal, ofensivo, amenazante, difamatorio, pornográfico, obsceno o de otra manera objetable, o que viole la propiedad intelectual de cualquier parte o estos Términos.
         </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>4. Propiedad Intelectual</Typography>
        <Typography paragraph>
            El portal y su contenido original (excluyendo el contenido proporcionado por los usuarios), características y funcionalidad son y seguirán siendo propiedad exclusiva de {orgName} y sus licenciantes. El nombre "CONALJUVE", su logo y otros gráficos son marcas registradas o identificadores de la organización.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>5. Enlaces a Terceros</Typography>
        <Typography paragraph>
            Nuestro portal puede contener enlaces a sitios web o servicios de terceros que no son propiedad ni están controlados por nosotros. No tenemos control ni asumimos responsabilidad por el contenido, políticas de privacidad o prácticas de sitios web o servicios de terceros.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>6. Terminación</Typography>
        <Typography paragraph>
            Podemos cancelar o suspender tu acceso al portal inmediatamente, sin previo aviso ni responsabilidad, por cualquier motivo, incluido, entre otros, si incumples los Términos.
        </Typography>
      </Box>

       <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>7. Descargo de Responsabilidad</Typography>
         <Typography paragraph>
             El portal se proporciona "TAL CUAL" y "SEGÚN DISPONIBILIDAD". El uso del portal es bajo tu propio riesgo. No garantizamos que el portal funcione de manera ininterrumpida, segura o libre de errores.
         </Typography>
      </Box>

       <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>8. Limitación de Responsabilidad</Typography>
         <Typography paragraph>
             En la máxima medida permitida por la ley aplicable, en ningún caso {orgName}, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables de daños indirectos, incidentales, especiales, consecuentes o punitivos... (Consulta a un abogado para esta cláusula).
         </Typography>
      </Box>

        <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>9. Ley Aplicable</Typography>
        <Typography paragraph>
            Estos Términos se regirán e interpretarán de acuerdo con las leyes del Estado Plurinacional de Bolivia, sin tener en cuenta sus disposiciones sobre conflicto de leyes.
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h2" gutterBottom>10. Cambios a los Términos</Typography>
        <Typography paragraph>
             Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. Te notificaremos de cualquier cambio publicando los nuevos Términos en esta página y actualizando la fecha de "Última actualización". Se considera que tu uso continuado del portal después de dichos cambios constituye tu aceptación de los nuevos Términos.
        </Typography>
      </Box>

        <Box>
        <Typography variant="h4" component="h2" gutterBottom>11. Contacto</Typography>
        <Typography paragraph>
            Si tienes alguna pregunta sobre estos Términos, por favor contáctanos en: <Link href={`mailto:${contactEmail}`}>{contactEmail}</Link>
        </Typography>
      </Box>

    </Container>
  );
};

export default TermsOfServicePage;