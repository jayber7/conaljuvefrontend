// src/data/institutionData.js

export const institutionContent = {
    'organigrama': {
        title: 'EL COMITÉ EJECUTIVO NACIONAL (C.E.N.)',
        type: 'image',
        description: 'PRESIDENTE:	MARIO MITA DAZA',
        imageUrl: '/assets/institution/organigrama-conaljuve.png' // Asegúrate que esta imagen exista
    },
    'estatuto': {
        title: 'Estatuto Orgánico CONALJUVE',
        type: 'pdf',
        description: 'Documento oficial que rige la estructura y funcionamiento de la confederación.',
        pdfUrl: '/docs/estatuto-organico-conaljuve.pdf' // Asegúrate que este PDF exista
    },
    'estatuto-fed-dptal': {
       title: 'Estatuto Marco - Federaciones Departamentales',
       type: 'pdf',
       description: 'Documento base para los estatutos de las federaciones departamentales.',
       pdfUrl: '/docs/estatuto-marco-fedejuve.pdf' // Asegúrate que este PDF exista
   },
    'directorio-nacional': {
        title: 'Directorio CEN CONALJUVE (Gestión Actual)',
        type: 'directory',
        members: [
            { name: 'MARIO MITA DAZA', role: 'Presidente/a' },
            { name: 'JUSTINO APAZA CALLISAYA', role: 'Vicepresidente/a' },
            { name: 'NICASIO RIOS', role: 'Vicepresidente/a' },
            { name: 'JOSE ANTONIO FLORES', role: 'Strio. General' },
            { name: 'ALBERTO PEREZ TUMIRI', role: 'Stria. De Relaciones' },
            { name: 'MARIELA CONDE HERRERA', role: 'Strio. De Hacienda' },
            { name: 'JOSE LUIS GARCIA PADILLA', role: 'Strio. De Actas' },
            // ... Completar con nombres reales ...
            { name: 'NATIVIDAD VARGAS ORELLANA', role: 'Vocal' },
            { name: 'SARA BAZOALTO CRUZ', role: 'Vocal' },
        ]
    },
    'vision-mision': {
        title: 'VISION Y MISION',
        type: 'text',
        content: [
            { subtitle: 'Visión', text: 'La CONALJUVE-BOLIVIA tiene la visión de ser una organización líder y referente en el fortalecimiento de las Juntas Vecinales urbanas y periurbanas, promoviendo su participación activa en la gestión pública del desarrollo a nivel municipal, departamental y nacional. Buscamos asegurar el ejercicio pleno de los derechos individuales y colectivos de nuestros miembros, impulsando el poder vecinal, la participación y el control social, así como la justicia, la equidad, la democracia y el desarrollo sostenible. A través del fortalecimiento orgánico y procesos de capacitación y formación en áreas políticas, económicas, sociales y culturales, trabajamos para generar un impacto positivo en la vida de los miembros, las juntas vecinales y la sociedad, en armonía con la Madre Tierra, y contribuyendo al Vivir Bien.' },
            { subtitle: 'Misión', text: 'La CONALJUVE-BOLIVIA tiene como misión ser la vanguardia del país y pilar fundamental en la defensa de los derechos de sus miembros y de las familias, promoviendo la justicia, la libertad, la vida, la educación, la salud, la igualdad, la equidad, la transparencia y la lucha contra la corrupción y la burocracia, basándose en los principios y valores establecidos por la Constitución Política del Estado; promoviendo la participación democrática y el control social activo de las Juntas Vecinales en la elaboración de políticas públicas de desarrollo y la gestión de recursos a nivel nacional, departamental y municipal, para hacer valer y ejercer nuestros derechos constitucionales. A través de este proceso, buscamos recuperar, mediante la capacitación y formación, el desarrollo económico, productivo, industrial, social, político, cultural y autosostenible de las Juntas Vecinales urbanas y periurbanas, desde sus territorios en armonía con la Madre Tierra, para lograr el Vivir Bien.' },
        ]
    },
    'objeto-fines': {
        title: 'OBJETO Y FINES',
        type: 'text',
        content: [
            { subtitle: 'Objeto Principal',
                text: 'a) Representar y defender los Derechos Constitucionales de las juntas vecinales: Representar los intereses de las Juntas Vecinales ante los diferentes niveles del Estado Plurinacional de Bolivia, garantizando su participación activa en la formulación de políticas públicas que favorezcan su desarrollo social, económico y cultural. Defender los Derechos Constitucionalmente de todas y todos los miembros de las juntas vecinales ante cualquier vulneración, promoviendo la justicia y la equidad, garantizando su derecho a la defensa de sus derechos fundamentales y a un control social efectivo sobre las políticas públicas y de desarrollo.\n' +
                      'b) Mejoramiento Integral de las Juntas Vecinales: Luchamos por el desarrollo social, económico, político y cultural de las Juntas Vecinales de Bolivia, asegurando que las juntas vecinales tengan un papel protagónico en la toma de decisiones que afectan sus territorios urbanos. Promovemos la creación y ejecución de políticas de gestión de desarrollo que fortalezcan las capacidades de planificación, organización, seguimiento, ejecución y evaluación, con el fin de asegurar un futuro sostenible, equitativo y próspero para todas y todos los miembros de las juntas vecinales urbanas y periurbanas.\n' +
                      'c) Consolidación de la Democracia Participativa y el Poder Vecinal: Trabajamos por la consolidación de una democracia verdaderamente participativa vecinal de cada miembro, que garantice la justicia social y la equidad. debemos recuperar y fortalecer el poder vecinal para que las juntas vecinales sean protagonistas en la toma de decisiones políticas, económicas y sociales, eliminando toda forma de discriminación y promoviendo la igualdad de oportunidades para todos. Defendemos una democracia donde las Juntas Vecinales puedan ejercer un control social efectivo sobre las políticas públicas de desarrollo en todos los niveles de organización del Estado Plurinacional de Bolivia.\n' +
                      'd) Exigencia de una Educación Fiscal Gratuita e Intercultural: Exigimos el derecho a una educación fiscal gratuita, intercultural e inclusiva que garantice una formación integral para nuestros niños, niñas y jóvenes, basada en los principios de interculturalidad, intraculturalidad y plurinacionalidad. Trabajaremos en coordinación con padres, maestros y autoridades educativas para asegurar que el sistema educativo sea accesible y respetuoso de las culturas y lenguas de los pueblos originarios, permitiendo una educación equitativa para todos los sectores de la sociedad.\n' + 
                      'e) Recuperación y Fortalecimiento de las Juntas Vecinales Urbanas y Periurbanas: Luchamos por la recuperación de la identidad y los derechos de las Juntas Vecinales urbanas y periurbanas a nivel nacional. Apoyamos a todas y todos los miembros en la defensa de su identidad cultural, promoviendo el respeto por sus tradiciones y hábitos de consumo originarios. Nos solidarizamos con los pueblos originarios y defendemos sus derechos históricos, impulsando un desarrollo que reconozca y valore las conquistas alcanzadas por nuestros antepasados.\n' +
                      'f) Promoción del Sistema Único de Salud y la Medicina Tradicional: Promoveremos por la creación de un Sistema Único de Salud accesible para toda la población del Estado Plurinacional de Bolivia, que garantice una atención oportuna y de calidad. Reconocemos la importancia de la medicina tradicional y natural, por lo que defendemos su integración y respeto dentro del sistema de salud nacional. El sistema de salud sea inclusivo, tomando en cuenta las prácticas médicas ancestrales y promoviendo una atención integral que respete la diversidad cultural.\n' +
                      'g) Capacitación y Formación de Nuevos Líderes Vecinales: Promovemos la formación continua de nuestros dirigentes vecinales, con el objetivo de fortalecer el liderazgo vecinal y formar nuevos líderes comprometidos con la construcción de una sociedad más justa, equitativa y democrática. A través de procesos de capacitación y formación en áreas políticas, económicas, sociales y culturales, buscamos fomentar la participación activa de nuestras Juntas Vecinales en la toma de decisiones, asegurando una representación efectiva en los procesos de gestión y desarrollo local, departamental y nacional.\n' +
                      'h) Defensa de los Derechos de las Personas Vulnerables: Luchamos por la protección y promoción de los derechos de los grupos más vulnerables, como niños, niñas, adolescentes, jóvenes, adultos mayores y personas con discapacidad. Defendemos su acceso a servicios esenciales como salud, educación, vivienda y seguridad. Trabajamos en políticas públicas inclusivas que garanticen su bienestar y su integración plena en la vida social, asegurando la participación de estos grupos en la toma de decisiones que les afectan.\n' +
                      'i) Gestión de Apoyo para los Miembros Emprendedores en las Juntas Vecinales: Gestionaremos el apoyo y colaboración para los emprendedores de las Juntas Vecinales, proporcionando recursos, herramientas y conocimientos clave para fortalecer sus iniciativas productivas y fomentar el desarrollo económico local. Promoveremos la capacitación continua en áreas esenciales como gestión empresarial, marketing, finanzas y desarrollo de habilidades, con el objetivo de mejorar la viabilidad y sostenibilidad de sus proyectos. Facilitaremos información sobre accesos a financiamiento, programas de apoyo económico, comercial y microcréditos disponibles, brindando orientación para que los emprendedores puedan aprovechar estas oportunidades. Fomentaremos la cooperación y el intercambio de experiencias entre los emprendedores de las Juntas Vecinales, creando espacios para el trabajo conjunto, el aprendizaje mutuo y el fortalecimiento de redes de colaboración. Además, colaboraremos en la adopción de prácticas sostenibles en los emprendimientos, promoviendo el uso responsable de los recursos naturales y apoyando iniciativas innovadoras que beneficien tanto a la economía local como a la comunidad.\n' +
                      'j) Mejora y ampliar los servicios básicos en las áreas urbanas y peri urbanos: Luchar por la mejora y ampliación de los servicios básicos en las Juntas Vecinales, garantizando el acceso universal a agua potable, electricidad, gas, saneamiento, recolección de basura e internet y otros como derechos fundamentales para la calidad de vida de los vecinos.\n' +
                      'k) Alianzas Estratégica Con Instituciones Y Organización Tanto Públicos Y Privados: El propósito de la firma de convenios de alianzas estratégicas es establecer colaboraciones mutuamente beneficiosas con instituciones y organizaciones afines, con el fin de fortalecer la capacidad de la CONALJUVE-BOLIVIA en la implementación de sus proyectos, promover el intercambio de conocimientos y recursos, y generar sinergias que contribuyan al logro de nuestros objetivos comunes en el desarrollo integral de las Juntas Vecinales. Estas alianzas buscan consolidar nuestra presencia y efectividad en la gestión pública y social, fomentando la cooperación en áreas clave como la participación ciudadana, y el desarrollo sostenible.\n' +
                      'l) Proponer Leyes, Normas, Procedimientos E Inscripción De Los Tramites De La Regularización Del Derecho Propietario En Áreas Urbanas: Las Juntas Vecinales, en su rol de realizar la gestión de apoyo a sus miembros, propician un proceso de regularización del derecho de propiedad en las áreas urbanas, mediante la socialización, asesoramiento técnico, administrativo y legal y facilitación la gestión ante las autoridades competentes permitiendo que los vecinos obtengan la titularidad legal de sus viviendas.\n' +
                      'm) Impulsar las manifestaciones sociales, deportiva, culturales de la CONALJUVE- BOLIVIA: impulsar las manifestaciones sociales, deportivas, culturales y otras en todo nivel; para lograr el crecimiento de valores y principios cívicos de los miembros de la organización.'},
            { subtitle: 'Fines Específicos', 
                text: 'El objeto de la CONALJUVE-BOLIVIA es representar defender sus derechos en todos los niveles del Estado Plurinacional a las Federaciones Departamentales de Juntas Vecinales, Federaciones de Juntas Vecinales Municipales Coordinadoras Periurbana, y por intermedio de estas a las Juntas vecinales establecidas en todo el Territorio Nacional del Estado Plurinacional, asimismo ante organismos internacionales y otros, con participación directa de nuestros miembros en equilibrio y armonía con la madre tierra, para el “Vivir Bien”.' }, // Ejemplo con saltos de línea
        ]
    },
    'tribunal': {
        title: 'Tribunal de honor y disiplinario',
        type: 'text',
        content: [
            { subtitle: 'Presidente mesa directiva', text: 'Pdt. Miembro' },
            { subtitle: 'Normativa', text: 'pdf' },
        ]
    },
    // Añade más secciones si es necesario
};

export default institutionContent;