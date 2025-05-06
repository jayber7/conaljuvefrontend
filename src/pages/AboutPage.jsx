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
        La CONALJUVE-BOLIVIA, es una Persona Jurídica, de carácter social, sin fines de lucro, constituida por las Federaciones Departamentales de Juntas Vecinales, Federación de Juntas Vecinales Municipales y Coordinadoras Periurbanas de Juntas Vecinales del territorio Nacional, al amparo de la Constitución Política del Estado y con observancia de las normas vigentes en el Estado Plurinacional.
        </Typography>
        <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4, textAlign: 'center', fontStyle: 'italic' }}>
        La CONALJUVE-BOLIVIA, es la máxima organización nacional con poder de decisión de las Juntas Vecinales de Bolivia, para hacer prevalecer sus derechos y para funcionar de manera autónoma por medio de una estructura orgánica propia. Es ajena a toda actividad política partidista de la tradicional oligarquía, teniendo sus miembros, derechos y obligaciones en lo orgánico, político, económico, social y cultural que les confiere el presente Estatuto, sin discriminación de ninguna naturaleza.
        </Typography>
        {/* Sección Origen */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" component="h2" gutterBottom color="primary.dark">
             <InfoIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.5em' }} />
             MISIÓN, VISIÓN, OBJETO Y FINES
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
          (MISIÓN).- La CONALJUVE-BOLIVIA tiene como misión ser la vanguardia del país y pilar fundamental en la defensa de los derechos de sus miembros y de las familias, promoviendo la justicia, la libertad, la vida, la educación, la salud, la igualdad, la equidad, la transparencia y la lucha contra la corrupción y la burocracia, basándose en los principios y valores establecidos por la Constitución Política del Estado; promoviendo la participación democrática y el control social activo de las Juntas Vecinales en la elaboración de políticas públicas de desarrollo y la gestión de recursos a nivel nacional, departamental y municipal, para hacer valer y ejercer nuestros derechos constitucionales. A través de este proceso, buscamos recuperar, mediante la capacitación y formación, el desarrollo económico, productivo, industrial, social, político, cultural y autosostenible de las Juntas Vecinales urbanas y periurbanas, desde sus territorios en armonía con la Madre Tierra, para lograr el Vivir Bien. -----
Artículo 7. (VISIÓN). - La CONALJUVE-BOLIVIA tiene la visión de ser una organización líder y referente en el fortalecimiento de las Juntas Vecinales urbanas y periurbanas, promoviendo su participación activa en la gestión pública del desarrollo a nivel municipal, departamental y nacional. Buscamos asegurar el ejercicio pleno de los derechos individuales y colectivos de nuestros miembros, impulsando el poder vecinal, la participación y el control social, así como la justicia, la equidad, la democracia y el desarrollo sostenible. A través del fortalecimiento orgánico y procesos de capacitación y formación en áreas políticas, económicas, sociales y culturales, trabajamos para generar un impacto positivo en la vida de los miembros, las juntas vecinales y la sociedad, en armonía con la Madre Tierra, y contribuyendo al Vivir Bien.
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
              <ListItemText primary="a)	Representar y defender los Derechos Constitucionales de las juntas vecinales: Representar los intereses de las Juntas Vecinales ante los diferentes niveles del Estado Plurinacional de Bolivia, garantizando su participación activa en la formulación de políticas públicas que favorezcan su desarrollo social, económico y cultural. Defender los Derechos Constitucionalmente de todas y todos los miembros de las juntas vecinales ante cualquier vulneración, promoviendo la justicia y la equidad, garantizando su derecho a la defensa de sus derechos fundamentales y a un control social efectivo sobre las políticas públicas y de desarrollo." />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="b)	Mejoramiento Integral de las Juntas Vecinales: Luchamos por el desarrollo social, económico, político y cultural de las Juntas Vecinales de Bolivia, asegurando que las juntas vecinales tengan un papel protagónico en la toma de decisiones que afectan sus territorios urbanos. Promovemos la creación y ejecución de políticas de gestión de desarrollo que fortalezcan las capacidades de planificación, organización, seguimiento, ejecución y evaluación, con el fin de asegurar un futuro sostenible, equitativo y próspero para todas y todos los miembros de las juntas vecinales urbanas y periurbanas.
." />
            </ListItem>
             <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="c)	Consolidación de la Democracia Participativa y el Poder Vecinal: Trabajamos por la consolidación de una democracia verdaderamente participativa vecinal de cada miembro, que garantice la justicia social y la equidad. debemos recuperar y fortalecer el poder vecinal para que las juntas vecinales sean protagonistas en la toma de decisiones políticas, económicas y sociales, eliminando toda forma de discriminación y promoviendo la igualdad de oportunidades para todos. Defendemos una democracia donde las Juntas Vecinales puedan ejercer un control social efectivo sobre las políticas públicas de desarrollo en todos los niveles de organización del Estado Plurinacional de Bolivia." />
            </ListItem>
             <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="d)	Exigencia de una Educación Fiscal Gratuita e Intercultural: Exigimos el derecho a una educación fiscal gratuita, intercultural e inclusiva que garantice una formación integral para nuestros niños, niñas y jóvenes, basada en los principios de interculturalidad, intraculturalidad y plurinacionalidad. Trabajaremos en coordinación con padres, maestros y autoridades educativas para asegurar que el sistema educativo sea accesible y respetuoso de las culturas y lenguas de los pueblos originarios, permitiendo una educación equitativa para todos los sectores de la sociedad." />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="e)	Recuperación y Fortalecimiento de las Juntas Vecinales Urbanas y Periurbanas: Luchamos por la recuperación de la identidad y los derechos de las Juntas Vecinales urbanas y periurbanas a nivel nacional. Apoyamos a todas y todos los miembros en la defensa de su identidad cultural, promoviendo el respeto por sus tradiciones y hábitos de consumo originarios. Nos solidarizamos con los pueblos originarios y defendemos sus derechos históricos, impulsando un desarrollo que reconozca y valore las conquistas alcanzadas por nuestros antepasados." />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="f)	Promoción del Sistema Único de Salud y la Medicina Tradicional: Promoveremos por la creación de un Sistema Único de Salud accesible para toda la población del Estado Plurinacional de Bolivia, que garantice una atención oportuna y de calidad. Reconocemos la importancia de la medicina tradicional y natural, por lo que defendemos su integración y respeto dentro del sistema de salud nacional. El sistema de salud sea inclusivo, tomando en cuenta las prácticas médicas ancestrales y promoviendo una atención integral que respete la diversidad cultural." />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="g) Capacitación y Formación de Nuevos Líderes Vecinales: Promovemos la formación continua de nuestros dirigentes vecinales, con el objetivo de fortalecer el liderazgo vecinal y formar nuevos líderes comprometidos con la construcción de una sociedad más justa, equitativa y democrática. A través de procesos de capacitación y formación en áreas políticas, económicas, sociales y culturales, buscamos fomentar la participación activa de nuestras Juntas Vecinales en la toma de decisiones, asegurando una representación efectiva en los procesos de gestión y desarrollo local, departamental y nacional."/>
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="h)	Defensa de los Derechos de las Personas Vulnerables: Luchamos por la protección y promoción de los derechos de los grupos más vulnerables, como niños, niñas, adolescentes, jóvenes, adultos mayores y personas con discapacidad. Defendemos su acceso a servicios esenciales como salud, educación, vivienda y seguridad. Trabajamos en políticas públicas inclusivas que garanticen su bienestar y su integración plena en la vida social, asegurando la participación de estos grupos en la toma de decisiones que les afectan." />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="i)	Gestión de Apoyo para los Miembros Emprendedores en las Juntas Vecinales: Gestionaremos el apoyo y colaboración para los emprendedores de las Juntas Vecinales, proporcionando recursos, herramientas y conocimientos clave para fortalecer sus iniciativas productivas y fomentar el desarrollo económico local. Promoveremos la capacitación continua en áreas esenciales como gestión empresarial, marketing, finanzas y desarrollo de habilidades, con el objetivo de mejorar la viabilidad y sostenibilidad de sus proyectos. Facilitaremos información sobre accesos a financiamiento, programas de apoyo económico, comercial y microcréditos disponibles, brindando orientación para que los emprendedores puedan aprovechar estas oportunidades. Fomentaremos la cooperación y el intercambio de experiencias entre los emprendedores de las Juntas Vecinales, creando espacios para el trabajo conjunto, el aprendizaje mutuo y el fortalecimiento de redes de colaboración. Además, colaboraremos en la adopción de prácticas sostenibles en los emprendimientos, promoviendo el uso responsable de los recursos naturales y apoyando iniciativas innovadoras que beneficien tanto a la economía local como a la comunidad." />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="j)	mejora y ampliar los servicios básicos en las áreas urbanas y peri urbanos: Luchar por la mejora y ampliación de los servicios básicos en las Juntas Vecinales, garantizando el acceso universal a agua potable, electricidad, gas, saneamiento, recolección de basura e internet y otros como derechos fundamentales para la calidad de vida de los vecinos." />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="k)	Alianzas Estratégica Con Instituciones Y Organización Tanto Públicos Y Privados: El propósito de la firma de convenios de alianzas estratégicas es establecer colaboraciones mutuamente beneficiosas con instituciones y organizaciones afines, con el fin de fortalecer la capacidad de la CONALJUVE-BOLIVIA en la implementación de sus proyectos, promover el intercambio de conocimientos y recursos, y generar sinergias que contribuyan al logro de nuestros objetivos comunes en el desarrollo integral de las Juntas Vecinales. Estas alianzas buscan consolidar nuestra presencia y efectividad en la gestión pública y social, fomentando la cooperación en áreas clave como la participación ciudadana, y el desarrollo sostenible." />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="l)	Proponer Leyes, Normas, Procedimientos E Inscripción De Los Tramites De La Regularización Del Derecho Propietario En Áreas Urbanas: Las Juntas Vecinales, en su rol de realizar la gestión de apoyo a sus miembros, propician un proceso de regularización del derecho de propiedad en las áreas urbanas, mediante la socialización, asesoramiento técnico, administrativo y legal y facilitación la gestión ante las autoridades competentes permitiendo que los vecinos obtengan la titularidad legal de sus viviendas." />
            </ListItem>
            <ListItem>
              <ListItemIcon><CheckCircleIcon color="secondary" /></ListItemIcon>
              <ListItemText primary="m)	Impulsar las manifestaciones sociales, deportiva, culturales de la CONALJUVE- BOLIVIA: impulsar las manifestaciones sociales, deportivas, culturales y otras en todo nivel; para lograr el crecimiento de valores y principios cívicos de los miembros de la organización." />
            </ListItem>
          </List>
           <Typography variant="body1" paragraph sx={{ mt: 2 }}>
           (OBJETO):
          </Typography>
           <List dense>
               {/* Puedes usar los mismos iconos o variar */}
               <ListItem><ListItemIcon><CheckCircleIcon color="primary" /></ListItemIcon><ListItemText primary="El objeto de la CONALJUVE-BOLIVIA es representar defender sus derechos en todos los niveles del Estado Plurinacional a las Federaciones Departamentales de Juntas Vecinales, Federaciones de Juntas Vecinales Municipales  Coordinadoras Periurbana, y por intermedio de estas a las Juntas vecinales establecidas en todo el Territorio Nacional del Estado Plurinacional, asimismo ante organismos internacionales y otros, con participación directa de nuestros miembros en equilibrio y armonía con la madre tierra, para el “Vivir Bien”." /></ListItem>
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