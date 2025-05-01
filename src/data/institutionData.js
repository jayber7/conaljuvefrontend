// src/data/institutionData.js

export const institutionContent = {
    'organigrama': {
        title: 'Organigrama Estructural CONALJUVE',
        type: 'image',
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
            { name: '(Nombre Presidente)', role: 'Presidente/a' },
            { name: '(Nombre Vicepresidente)', role: 'Vicepresidente/a' },
            { name: '(Nombre Strio. General)', role: 'Strio. General' },
            { name: '(Nombre Strio. Relaciones)', role: 'Stria. De Relaciones' },
             { name: '(Nombre Strio. Organización)', role: 'Strio. De Organización' },
            // ... Completar con nombres reales ...
            { name: '(Nombre Vocal 1)', role: 'Vocal' },
            { name: '(Nombre Vocal 2)', role: 'Vocal' },
        ]
    },
    'vision-mision': {
        title: 'Visión y Misión',
        type: 'text',
        content: [
            { subtitle: 'Visión', text: 'Ser la organización vecinal líder, unida y fortalecida, que contribuye activamente al desarrollo integral y sostenible de Bolivia, garantizando el ejercicio pleno de los derechos ciudadanos y una vida digna en todos los barrios del país.' },
            { subtitle: 'Misión', text: 'Representar, articular y defender los intereses de las juntas vecinales y sus habitantes ante todas las instancias, promoviendo la participación democrática, el control social, la gestión transparente y la búsqueda de soluciones a las demandas comunitarias para alcanzar el Vivir Bien.' },
        ]
    },
    'objeto-fines': {
        title: 'Objeto y Fines',
        type: 'text',
        content: [
            { subtitle: 'Objeto Principal', text: 'El objeto principal de CONALJUVE es la representación y defensa de los derechos e intereses colectivos de las y los vecinos organizados en Juntas Vecinales en todo el territorio del Estado Plurinacional de Bolivia.' },
            { subtitle: 'Fines Específicos', text: '1. Fortalecer la unidad y organización del movimiento vecinal.\n2. Promover la participación ciudadana y el control social.\n3. Gestionar y canalizar demandas de servicios básicos, infraestructura, seguridad, etc.\n4. Fiscalizar la gestión pública.\n5. Defender la democracia y los derechos humanos.\n6. Capacitar y formar a dirigentes vecinales.\n7. Fomentar la equidad de género y la inclusión social.\n8. Promover el cuidado del medio ambiente.' }, // Ejemplo con saltos de línea
        ]
    },
    // Añade más secciones si es necesario
};

export default institutionContent;