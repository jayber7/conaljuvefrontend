// src/pages/AboutPage.jsx
import React from 'react';
import { Box, Container, Typography, Paper, Grid, Card, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info'; // Icono genérico de información
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icono para listas de principios/objetivos
import GroupsIcon from '@mui/icons-material/Groups'; // Icono para estructura
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; // Icono para Congreso
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'; // Icono para Comité Ejecutivo
import DomainIcon from '@mui/icons-material/Domain'; // Icono para Federaciones Deptales
import LocationCityIcon from '@mui/icons-material/LocationCity'; // Icono para Federaciones Regionales

const AboutPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}> {/* Contenedor más estrecho para texto */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: '12px' }}>
        <Typography variant="h1" component="h1" gutterBottom align="center" sx={{ mb: 3 }}>
          ¿Qué es CONALJUVE?
        </Typography>

        <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4, textAlign: 'center', fontStyle: 'italic' }}>
          La Confederación Nacional de Juntas Vecinales de Bolivia (CONALJUVE) es la máxima organización representativa de las juntas vecinales en todo el territorio nacional.
        </Typography>

        {/* Sección Origen */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" component="h2" gutterBottom color="primary.dark">
             <InfoIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.5em' }} />
             Origen y Fundación
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
            CONALJUVE fue fundada con la misión fundamental de unificar la voz y coordinar las acciones de las juntas vecinales a nivel nacional. Su creación respondió a la necesidad histórica de fortalecer la participación ciudadana activa en la toma de decisiones que afectan el desarrollo local y nacional. Nació como un ente aglutinador frente a la dispersión de las organizaciones vecinales existentes, buscando una representación sólida y efectiva.
          </Typography>
        </Box>

        {/* Sección Principios y Objetivos */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" component="h2" gutterBottom color="primary.dark">
             <CheckCircleIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.5em' }} />
            Principios y Objetivos
          </Typography>
          <Typography variant="body1" paragraph>
            Los pilares fundamentales que guían el accionar de CONALJUVE son:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="La defensa inclaudicable de los derechos e intereses colectivos de los vecinos y sus comunidades." />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="La promoción activa de la democracia participativa, el control social efectivo y la transparencia en la gestión pública." />
            </ListItem>
             <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="La lucha constante por mejorar las condiciones de vida en los barrios, exigiendo servicios básicos de calidad, seguridad ciudadana, infraestructura adecuada y desarrollo sostenible." />
            </ListItem>
             <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="El fortalecimiento de la unidad, la organización y la capacidad de gestión del movimiento vecinal." />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="La fiscalización rigurosa de la gestión pública en todos los niveles de gobierno (municipal, departamental, nacional)." />
            </ListItem>
          </List>
           <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            Sus objetivos estratégicos incluyen:
          </Typography>
           <List dense>
               {/* Puedes usar los mismos iconos o variar */}
               <ListItem><ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon><ListItemText primary="Representar legítimamente a las juntas vecinales ante instancias gubernamentales, organizaciones sociales y entidades privadas." /></ListItem>
               <ListItem><ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon><ListItemText primary="Gestionar, canalizar y hacer seguimiento a las demandas y necesidades vecinales." /></ListItem>
               <ListItem><ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon><ListItemText primary="Promover la capacitación integral y la formación de liderazgos vecinales comprometidos y eficientes." /></ListItem>
               <ListItem><ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon><ListItemText primary="Fomentar la solidaridad, la cooperación mutua y el intercambio de experiencias entre las juntas vecinales." /></ListItem>
               <ListItem><ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon><ListItemText primary="Contribuir activamente al desarrollo integral y equitativo de las comunidades y del país." /></ListItem>
           </List>
        </Box>

        {/* Sección Estructura */}
        <Box sx={{ mb: 5 }}>
           <Typography variant="h3" component="h2" gutterBottom color="primary.dark">
             <GroupsIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.5em' }} />
            Estructura Organizativa
          </Typography>
           <Typography variant="body1" paragraph>
             CONALJUVE opera bajo una estructura democrática y representativa, cuyas principales instancias son:
           </Typography>
           <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                          <Typography variant="h5" component="div" gutterBottom align="center">
                              <AccountBalanceIcon color="primary" sx={{ fontSize: 40, mb: 1 }}/> <br/>
                              Congreso Nacional
                          </Typography>
                          <Typography variant="body2" color="text.secondary" align="center">
                              Máxima instancia de deliberación y decisión, donde participan delegados democráticamente electos de todas las federaciones afiliadas. Define las líneas políticas y elige a la directiva nacional.
                          </Typography>
                      </CardContent>
                  </Card>
              </Grid>
               <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                          <Typography variant="h5" component="div" gutterBottom align="center">
                             <PeopleAltIcon color="primary" sx={{ fontSize: 40, mb: 1 }}/> <br/>
                             Comité Ejecutivo Nacional (CEN)
                          </Typography>
                          <Typography variant="body2" color="text.secondary" align="center">
                              Directiva nacional elegida en Congreso. Es la instancia ejecutiva encargada de la gestión diaria, la representación permanente y la implementación de las resoluciones del Congreso.
                          </Typography>
                      </CardContent>
                  </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                          <Typography variant="h5" component="div" gutterBottom align="center">
                             <DomainIcon color="primary" sx={{ fontSize: 40, mb: 1 }}/> <br/>
                             Federaciones Departamentales (FEDEJUVEs)
                          </Typography>
                          <Typography variant="body2" color="text.secondary" align="center">
                              Organizaciones que agrupan y representan a las juntas vecinales de cada uno de los nueve departamentos de Bolivia. Coordinan acciones a nivel departamental.
                          </Typography>
                      </CardContent>
                  </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent>
                           <Typography variant="h5" component="div" gutterBottom align="center">
                             <LocationCityIcon color="primary" sx={{ fontSize: 40, mb: 1 }}/> <br/>
                              Federaciones Regionales/Distritales
                          </Typography>
                          <Typography variant="body2" color="text.secondary" align="center">
                              Instancias intermedias de organización presentes en ciudades grandes o regiones específicas, que agrupan juntas vecinales por distritos o zonas geográficas.
                          </Typography>
                      </CardContent>
                  </Card>
              </Grid>
           </Grid>
        </Box>

         {/* Sección Importancia */}
        <Box>
           <Typography variant="h3" component="h2" gutterBottom color="primary.dark">
               <InfoIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.5em' }} />
              Importancia
           </Typography>
           <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
             CONALJUVE desempeña un rol protagónico en la sociedad civil boliviana. Es un actor fundamental en la defensa y profundización de la democracia, la promoción incansable de la participación ciudadana desde la base territorial y la articulación de las demandas populares. Su influencia se extiende a la formulación e implementación de políticas públicas locales y nacionales en áreas cruciales como el desarrollo urbano sostenible, la seguridad ciudadana, el acceso a servicios básicos y la mejora de la calidad de vida en los barrios de Bolivia.
           </Typography>
        </Box>

      </Paper>
    </Container>
  );
};

export default AboutPage;