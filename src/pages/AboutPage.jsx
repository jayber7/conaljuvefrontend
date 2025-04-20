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
        LA CONFEDERACIÓN NACIONAL DE JUNTAS VECINALES DE BOLIVIA - “CONALJUVE” ENTIDAD CIVIL SIN FINES DE LUCRO.
        </Typography>

        {/* Sección Origen */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" component="h2" gutterBottom color="primary.dark">
             <InfoIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.5em' }} />
             MISIÓN, VISIÓN, OBJETO Y FINES
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
          (MISIÓN).- La CONALJUVE-BOLIVIA tiene por misión ser la vanguardia del país y pilar fundamental en la defensa de los derechos de la familia, luchando por la justicia, igualdad, equidad, transparencia, lucha contra la corrupción, contra la burocracia, con honestidad; promoviendo la participación y control social activa de las Juntas Vecinales en la elaboración de políticas públicas y gestión de recursos a nivel nacional, departamental y municipal, para hacer respetar y ejercer nuestros derechos constitucionales, la equidad de género y recuperar un desarrollo económico, productivo, industrial, social, político, cultural, e integral, de las Juntas Vecinales urbanas y periurbanas, desde sus regiones en armonía con la madre tierra, para VIVIR BIEN.    
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
          (VISIÓN).- La CONALJUVE-BOLIVIA tiene por visión defender la equidad, la inclusión y participación en la Gestión Pública activa de las Juntas Vecinales, con poder de decisión política, económica y social en el país para recuperar el poder vecinal, con participación y control social, con toma de decisiones en las Políticas Públicas, respetar y reafirmar nuestras culturas, valores, principios ideológicos; el ejercicio pleno de nuestros derechos individuales y colectivos, a través del fortalecimiento orgánico mediante procesos de capacitación en las áreas políticas, económicas, sociales, culturales en coordinación con nuestros miembros departamentales, y municipales hasta alcanzar un desarrollo integral urbano y periurbano.
          </Typography>
        </Box>

        {/* Sección Principios y Objetivos */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" component="h2" gutterBottom color="primary.dark">
             <CheckCircleIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.5em' }} />
             (FINES). – Los fines de la CONALJUVE-BOLIVIA son:
          </Typography>
          <Typography variant="body1" paragraph>
            Los pilares fundamentales que guían el accionar de CONALJUVE son:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="a)	Representar y defender a sus miembros ante la vulneración de sus Derechos Constitucionalmente protegidos. " />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="b)	Luchar por el mejoramiento social, económico, político y cultural de las Juntas Vecinales de Bolivia." />
            </ListItem>
             <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="c)	Luchar por la consolidación de la democracia participativa, comunitaria, verdadera, solidaria y libertadora con justicia social, cuyo fin radique en eliminar toda forma de discriminación, confiriendo igualdad de oportunidades para todos nuestros miembros." />
            </ListItem>
             <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="d)	Exigir una educación fiscal gratuita para nuestros hijos, en coordinación con padres de familia, profesores y autoridades educativas en base a la intraculturalidad e interculturalidad y plurinacionalidad. " />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="e)	Luchar por las juntas vecinales periurbanas a nivel Nacional, recuperando su identidad, hábitos de consumo de sus orígenes, solidarizándonos con los pueblos originarios, por las conquistas alcanzadas por nuestros antepasados, garantizando sus derechos constitucionales." />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="f)	Luchar por el Sistema Único de Salud, para una atención oportuna en salud, el reconocimiento de nuestros médicos tradicionales y el respeto e implementación de la medicina tradicional o natural. " />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="g)	Promover la capacitación de nuestros dirigentes vecinales, para formar nuevos líderes, que luchen por una sociedad más justa." />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="h)	Promover y defender los derechos de los niños, niñas, adolescentes, jóvenes, adultos mayores y personas vulnerables." />
            </ListItem>
          </List>
           <Typography variant="body1" paragraph sx={{ mt: 2 }}>
           (OBJETO):
          </Typography>
           <List dense>
               {/* Puedes usar los mismos iconos o variar */}
               <ListItem><ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon><ListItemText primary="El objeto de la CONALJUVE-BOLIVIA es representar defender sus derechos en todos los niveles del Estado Plurinacional a las Federaciones Departamentales de Juntas Vecinales, Federaciones de Juntas Vecinales Municipales y por intermedio de estas a las Juntas vecinales establecidas en todo el Territorio Nacional del Estado Plurinacional, asimismo ante organismos internacionales y otros, con participación directa de nuestros miembros en equilibrio y armonía con la madre tierra, para el “Vivir Bien”." /></ListItem>
               <ListItem><ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon><ListItemText primary="(ALCANCE DE LAS ACTIVIDADES). - Los alcances de las actividades del ente matriz vecinal están orientadas a lograr el bien común, entendiéndose como el beneficio en favor de nuestros miembros y la de sus familias para el vivir bien. " /></ListItem>
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
                              FEDERACIÓN DE JUNTAS VECINALES DE CHUQUISACA (FEDJUVE-CH)
                              FEDERACIÓN DE JUNTAS VECINALES DE COCHABAMBA (FEDJUVE-CBB)
                              FEDERACIÓN DE JUNTAS VECINALES DE PANDO (FEDJUVE-PANDO)
                              COORDINADORA DEPARTAMENTAL DE JUNTAS VECINALES PERIURBANAS Y ORGANIZACIONES TERRITORIALES DE BASE (CODJUVEPURO).
                              FEDERACIÓN DE JUNTAS VECINALES FEJUVE – CERCADO. (BENI)

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