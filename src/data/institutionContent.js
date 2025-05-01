// Ejemplo en InstitutionPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, /*...*/ } from '@mui/material';
import institutionContent from '../../data/institutionData'; // <-- Importar datos locales

const InstitutionPage = () => {
    const { sectionId } = useParams();
    const [sectionData, setSectionData] = useState(null);
    // Ya no necesitas loading/error para fetch, pero sí para el caso de ID inválido
    const [error, setError] = useState('');

    useEffect(() => {
        setError('');
        const data = institutionContent[sectionId];
        if (data) {
            setSectionData(data);
        } else {
            setError(`La sección "${sectionId}" no fue encontrada.`);
             setSectionData(null); // Asegurar que no queden datos viejos
        }
    }, [sectionId]);

    // Quitar return de loading
    if (error) return <Container><Alert severity="error">{error}</Alert></Container>;
    if (!sectionData) return null; // O un componente NotFound simple

    // ... (resto del renderizado usando sectionData) ...
};
export default InstitutionPage;