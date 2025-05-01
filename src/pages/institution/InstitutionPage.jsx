// src/pages/institution/InstitutionPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, Alert } from '@mui/material';
import institutionContent from '../../data/institutionData';

// --- IMPORTAR COMPONENTES REUTILIZABLES ---
import ImageDisplay from '../../components/Content/ImageDisplay';
import PdfViewerLink from '../../components/Content/PdfViewerLink';
import DirectoryList from '../../components/Content/DirectoryList';
import InfoSection from '../../components/Content/InfoSection';
// --- FIN IMPORTAR ---

const InstitutionPage = () => {
    const { sectionId } = useParams();
    const [sectionData, setSectionData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        setError('');
        const data = institutionContent[sectionId];
        if (data) {
            setSectionData(data);
        } else {
            setError(`La sección "${sectionId}" no fue encontrada.`);
            setSectionData(null);
        }
    }, [sectionId]);

    if (error) return <Container><Alert severity="error">{error}</Alert></Container>;
    if (!sectionData) return null; // O un componente de carga/no encontrado

    // --- RENDERIZADO USANDO COMPONENTES REUTILIZABLES ---
    const renderContent = () => {
        switch (sectionData.type) {
            case 'image':
                return <ImageDisplay src={sectionData.imageUrl} alt={sectionData.title} />;
            case 'pdf':
                return <PdfViewerLink href={sectionData.pdfUrl} description={sectionData.description} />;
            case 'directory':
                return <DirectoryList members={sectionData.members} />;
            case 'text':
                return <InfoSection content={sectionData.content} />;
            default:
                return <Typography>Tipo de contenido no soportado.</Typography>;
        }
    };
    // --- FIN RENDERIZADO ---

    return (
         <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={1} sx={{ p: { xs: 2, sm: 3, md: 4 }}}>
                 <Typography variant="h1" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
                    {sectionData.title}
                 </Typography>
                 {renderContent()} {/* Renderizar contenido usando los componentes */}
             </Paper>
         </Container>
    );
};

export default InstitutionPage;