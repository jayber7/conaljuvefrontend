// src/data/federationData.js

// Estructura de datos estática para Federaciones y Coordinadoras Departamentales
// ¡¡REEMPLAZAR PLACEHOLDERS [...] y '...' CON DATOS REALES!!

export const federationData = {
    // --- FEDERACIONES DEPARTAMENTALES ---
    'dptales': {
        'LP': {
            id: 'LP',
            name: 'Federación Departamental de Juntas Vecinales de La Paz (FEJUVE La Paz)',
            directory: [
                { name: '(Pdte. Fejuve LP)', role: 'Presidente/a' },
                { name: '(Vicepdte. Fejuve LP)', role: 'Vicepresidente/a' },
                /* ... más miembros directorio LP ... */
            ],
            statutesUrl: '/docs/federaciones/dptales/estatuto-fejuve-lp.pdf', // Ruta ejemplo
            description: 'Representando a las juntas vecinales del departamento de La Paz.'
         },
        'OR': {
             id: 'OR',
             name: 'Federación Departamental de Juntas Vecinales de Oruro (FEJUVE Oruro)',
             directory: [/* ... miembros ... */],
             statutesUrl: '/docs/federaciones/dptales/estatuto-fejuve-or.pdf', // Ruta ejemplo
             description: 'Organización matriz de las juntas vecinales del departamento de Oruro.'
         },
         'PT': {
            id: 'PT',
            name: 'Federación Departamental de Juntas Vecinales de Potosí (FEJUVE Potosí)',
            directory: [/* ... miembros ... */],
            statutesUrl: '/docs/federaciones/dptales/estatuto-fejuve-pt.pdf', // Ruta ejemplo
            description: 'Agrupando y representando al movimiento vecinal potosino.'
        },
        'CB': {
             id: 'CB',
             name: 'Federación Departamental de Juntas Vecinales de Cochabamba (FEJUVE Cochabamba)',
             directory: [/* ... miembros ... */],
             statutesUrl: '/docs/federaciones/dptales/estatuto-fejuve-cb.pdf', // Ruta ejemplo
             description: 'Instancia de representación de las juntas vecinales cochabambinas.'
         },
         'SC': {
            id: 'SC',
            name: 'Federación Departamental de Juntas Vecinales de Santa Cruz (FEJUVE Santa Cruz)',
            directory: [/* ... miembros ... */],
            statutesUrl: '/docs/federaciones/dptales/estatuto-fejuve-sc.pdf', // Ruta ejemplo
            description: 'Defendiendo los intereses de los vecinos del departamento de Santa Cruz.'
        },
         'BN': {
            id: 'BN',
            name: 'Federación Departamental de Juntas Vecinales de Beni (FEJUVE Beni)',
            directory: [/* ... miembros ... */],
            statutesUrl: '/docs/federaciones/dptales/estatuto-fejuve-bn.pdf', // Ruta ejemplo
            description: 'Articulando las demandas y propuestas de las juntas vecinales benianas.'
        },
         'PA': {
            id: 'PA',
            name: 'Federación Departamental de Juntas Vecinales de Pando (FEJUVE Pando)',
            directory: [/* ... miembros ... */],
            statutesUrl: '/docs/federaciones/dptales/estatuto-fejuve-pa.pdf', // Ruta ejemplo
            description: 'Organización representativa de los vecinos del departamento de Pando.'
        },
         'TJ': {
            id: 'TJ',
            name: 'Federación Departamental de Juntas Vecinales de Tarija (FEJUVE Tarija)',
            directory: [/* ... miembros ... */],
            statutesUrl: '/docs/federaciones/dptales/estatuto-fejuve-tj.pdf', // Ruta ejemplo
            description: 'Trabajando por el desarrollo y bienestar de los barrios tarijeños.'
        },
         'CH': {
            id: 'CH',
            name: 'Federación Departamental de Juntas Vecinales de Chuquisaca (FEJUVE Chuquisaca)',
            directory: [/* ... miembros ... */],
            statutesUrl: '/docs/federaciones/dptales/estatuto-fejuve-ch.pdf', // Ruta ejemplo
            description: 'Representación y gestión de las necesidades vecinales en Chuquisaca.'
        },
        // Opcional: Entradas para Directorio Nacional o Estatuto Marco si tienen página propia
         'DIRECTORIO': { id: 'DIRECTORIO', name: 'Directorio CEN CONALJUVE', directory: [/* Miembros CEN */], statutesUrl: null, description: 'Directiva Nacional de CONALJUVE.'},
         'ESTATUTO': { id: 'ESTATUTO', name: 'Estatuto Marco Federaciones Dptales.', directory: [], statutesUrl: '/docs/federaciones/dptales/estatuto-marco-fedejuve.pdf', description: 'Documento base para estatutos departamentales.'},
    },
    // --- FEDERACIONES MUNICIPALES ---
    // Simplificado: Una entrada por departamento. Ajusta si necesitas detalle por municipio.
    'muni': {
         'LP': { id: 'LP', name: 'Federaciones Municipales de La Paz', directory: [/* Podría listar directivas de Fejuve El Alto, Viacha, etc. */], statutesUrl: null, description: 'Información sobre las federaciones municipales del departamento de La Paz.' },
         'OR': { id: 'OR', name: 'Federaciones Municipales de Oruro', directory: [/*...*/], statutesUrl: null, description: '...' },
         'PT': { id: 'PT', name: 'Federaciones Municipales de Potosí', directory: [/*...*/], statutesUrl: null, description: '...' },
         'CB': { id: 'CB', name: 'Federaciones Municipales de Cochabamba', directory: [/*...*/], statutesUrl: null, description: '...' },
         'SC': { id: 'SC', name: 'Federaciones Municipales de Santa Cruz', directory: [/*...*/], statutesUrl: null, description: '...' },
         'BN': { id: 'BN', name: 'Federaciones Municipales de Beni', directory: [/*...*/], statutesUrl: null, description: '...' },
         'PA': { id: 'PA', name: 'Federaciones Municipales de Pando', directory: [/*...*/], statutesUrl: null, description: '...' },
         'TJ': { id: 'TJ', name: 'Federaciones Municipales de Tarija', directory: [/*...*/], statutesUrl: null, description: '...' },
         'CH': { id: 'CH', name: 'Federaciones Municipales de Chuquisaca', directory: [/*...*/], statutesUrl: null, description: '...' },
         // Opcional: Directorio/Estatuto general para municipales?
         'DIRECTORIO': { id: 'DIRECTORIO', name: 'Directorio General Fede. Muni.', directory: [], statutesUrl: null, description: ''},
         'ESTATUTO': { id: 'ESTATUTO', name: 'Estatuto Marco Fede. Muni.', directory: [], statutesUrl: '/docs/federaciones/muni/estatuto-marco-fedemuni.pdf', description: ''}, // Ejemplo
    },
    // --- COORDINADORAS DEPARTAMENTALES ---
     'coord': {
         'LP': { id: 'LP', name: 'Coordinadora Departamental de Juntas Vecinales de La Paz', directory: [/*...*/], statutesUrl: null, description: '...' },
         'OR': { id: 'OR', name: 'Coordinadora Departamental de Juntas Vecinales de Oruro', directory: [/*...*/], statutesUrl: null, description: '...' },
         'PT': { id: 'PT', name: 'Coordinadora Departamental de Juntas Vecinales de Potosí', directory: [/*...*/], statutesUrl: null, description: '...' },
         'CB': { id: 'CB', name: 'Coordinadora Departamental de Juntas Vecinales de Cochabamba', directory: [/*...*/], statutesUrl: null, description: '...' },
         'SC': { id: 'SC', name: 'Coordinadora Departamental de Juntas Vecinales de Santa Cruz', directory: [/*...*/], statutesUrl: null, description: '...' },
         'BN': { id: 'BN', name: 'Coordinadora Departamental de Juntas Vecinales de Beni', directory: [/*...*/], statutesUrl: null, description: '...' },
         'PA': { id: 'PA', name: 'Coordinadora Departamental de Juntas Vecinales de Pando', directory: [/*...*/], statutesUrl: null, description: '...' },
         'TJ': { id: 'TJ', name: 'Coordinadora Departamental de Juntas Vecinales de Tarija', directory: [/*...*/], statutesUrl: null, description: '...' },
         'CH': { id: 'CH', name: 'Coordinadora Departamental de Juntas Vecinales de Chuquisaca', directory: [/*...*/], statutesUrl: null, description: '...' },
         // Opcional: Directorio/Estatuto general para coordinadoras?
         'DIRECTORIO': { id: 'DIRECTORIO', name: 'Directorio General Coord.', directory: [], statutesUrl: null, description: ''},
         'ESTATUTO': { id: 'ESTATUTO', name: 'Estatuto Marco Coord.', directory: [], statutesUrl: '/docs/coordinadoras/estatuto-marco-coord.pdf', description: ''}, // Ejemplo
     }
};

export default federationData;