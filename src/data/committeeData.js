// src/data/committeeData.js

// Asegúrate que las rutas a imágenes y PDFs sean correctas (relativas a la carpeta public)
export const committeeData = {
    juventud: {
        title: 'Comité de Juventud',
        imageUrl: '/assets/committees/juventud-placeholder.jpg',
        members: [ 'Juan Perez (Coordinador)', 'Maria Garcia (Secretaria)', 'Carlos Lopez', 'Ana Ramirez', /* ...más nombres */ ],
        statutesUrl: '/docs/reglamento-comite-juventud.pdf', // Ejemplo de PDF
        decreeUrl: null,
        description: 'Impulsando la participación activa y formación de los jóvenes líderes vecinales en todo el país.',
    },
    profesionales: {
        title: 'Comité de Profesionales',
        imageUrl: '/assets/committees/profesionales-placeholder.jpg',
        members: [ 'Dr. Alberto Rios (Presidente)', 'Lic. Sofia Marquez (Vicepresidenta)', 'Ing. David Flores', 'Arq. Laura Mendoza', /* ...más nombres */ ],
        statutesUrl: '/docs/reglamento-comite-profesionales.pdf', // Ejemplo de PDF
        decreeUrl: null,
        description: 'Articulando a profesionales de diversas áreas para contribuir con propuestas técnicas y conocimiento especializado al desarrollo vecinal.',
    },
    mujeres: {
        title: 'Comité de Mujeres "Bartolina Sisa"',
        imageUrl: '/assets/committees/mujeres-placeholder.jpg',
        members: [ 'Elena Quispe (Líder)', 'Rosa Mamani', 'Carmen Choque', /* ...más nombres */ ],
        statutesUrl: '/docs/reglamento-comite-mujeres.pdf', // Ejemplo de PDF
        decreeUrl: null,
        description: 'Promoviendo la equidad de género, el empoderamiento y la participación plena de las mujeres en la vida vecinal y política.',
    },
    salud: {
        title: 'Comité de Salud Comunitaria',
        imageUrl: '/assets/committees/salud-placeholder.jpg',
        members: [ 'Dra. Isabel Castillo', 'Lic. Enf. Mario Vega', 'Promotor Luis Cruz', /* ...más nombres */ ],
        statutesUrl: null,
        decreeUrl: '/docs/normativa-salud-comunitaria.pdf', // Ejemplo de PDF
        description: 'Trabajando por el acceso a servicios de salud de calidad, la prevención y la promoción de hábitos saludables en los barrios.',
    },
    aliados: {
        title: 'Aliados Estratégicos',
        imageUrl: '/assets/committees/aliados-placeholder.jpg',
        members: [
            'ONG "Desarrollo Andino"',
            'Fundación "Techo Bolivia"',
            'Universidad Mayor de San Andrés (UMSA) - Proyectos Sociales',
            'Ministerio de Planificación (Coordinación)',
            // Añadir más logos o nombres si es necesario
        ],
        statutesUrl: null,
        decreeUrl: null,
        description: 'Instituciones y organizaciones que colaboran con CONALJUVE para alcanzar objetivos comunes en beneficio de las comunidades vecinales.',
    }
};

export default committeeData; // Exportar por defecto si solo tienes esto