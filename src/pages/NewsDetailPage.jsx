import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Link, Box, Container, Typography, CircularProgress, Alert, Divider, Paper, Chip } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // Icono para enlace PDF
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../services/api';
import CommentList from '../components/Comments/CommentList'; // Crear este componente
import CommentForm from '../components/Comments/CommentForm'; // Crear este componente
import { useAuth } from '../contexts/AuthContext';

const placeholderImage = 'https://dummyimage.com/800x400?text=Noticia';

const NewsDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');

  const fetchArticleAndComments = useCallback(async () => {
    setLoading(true);
    setError('');
    setCommentError('');
    try {
      // Fetch artículo
      const articleRes = await api.get(`/news/${id}`);
      setArticle(articleRes.data.data.news);

      // Fetch comentarios
      setCommentLoading(true);
      const commentsRes = await api.get(`/comments/news/${id}`);
      setComments(commentsRes.data.data.comments || []);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.response?.data?.message || 'No se pudo cargar la noticia.');
    } finally {
      setLoading(false);
      setCommentLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArticleAndComments();
  }, [fetchArticleAndComments]);

  // Función para añadir un nuevo comentario a la lista localmente
  const handleCommentAdded = (newComment) => {
      // Añadir al principio para que aparezca arriba
      setComments(prevComments => [newComment, ...prevComments]);
  };

  // Función para eliminar un comentario de la lista localmente
  const handleCommentDeleted = (deletedCommentId) => {
      setComments(prevComments => prevComments.filter(comment => comment._id !== deletedCommentId));
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ my: 3 }}>{error}</Alert>;
  }

  if (!article) {
    return <Typography>Noticia no encontrada.</Typography>; // O redirigir a 404
  }

  const formattedDate = article.publicationDate
    ? format(new Date(article.publicationDate), 'dd MMMM, yyyy', { locale: es })
    : 'Fecha desconocida';

  return (
    <Container maxWidth="md"> {/* Contenedor más estrecho para lectura */}
       <Paper elevation={2} sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 4}}>
          {/* --- Título y Metadatos --- */}
          <Typography variant="h1" component="h1" gutterBottom>
            {article.title}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
              <Typography variant="subtitle1" color="text.secondary">
                  Por: {article.author?.name || 'Autor Desconocido'}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                  {formattedDate}
              </Typography>
          </Box>
           {article.tags && article.tags.length > 0 && (
               <Box sx={{ mb: 2 }}>
                   {article.tags.map((tag, index) => (
                       <Chip key={index} label={tag} size="small" sx={{ mr: 1, mb: 1 }} />
                   ))}
               </Box>
           )}

          <Divider sx={{ mb: 3 }}/>

          {/* --- Imagen --- */}
          {article.imageUrl && <Box
              component="img"
              sx={{
                  width: '100%',
                  maxHeight: '450px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  mb: 3,
              }}
              src={article.imageUrl || placeholderImage}
              alt={article.title}
          />
          }
          {/* --- CONTENIDO (Texto O PDF) --- */}
          {article.pdfUrl ? (
                    // --- Mostrar Enlace/Visor PDF ---
                    <Box sx={{ my: 4, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            El contenido principal de esta noticia está en formato PDF.
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<PictureAsPdfIcon />}
                            href={article.pdfUrl} // Enlace directo al PDF en Cloudinary
                            target="_blank" // Abrir en nueva pestaña
                            rel="noopener noreferrer"
                            sx={{ color: 'primary.dark', fontWeight: 'bold'}}
                        >
                            Ver / Descargar PDF
                        </Button>
                        {/* Opcional: Embeber un visor de PDF (requiere librerías adicionales) */}
                        {/* <iframe src={article.pdfUrl} width="100%" height="600px" style={{ border: 'none', marginTop: '16px' }}></iframe> */}
                    </Box>
                ) : article.content ? (
                    // --- Mostrar Contenido de Texto ---
                    <Box className="news-content" sx={{ '& p': { mb: 2 }, lineHeight: 1.7 }}>
                        <Typography component="div" dangerouslySetInnerHTML={{ __html: article.content }} />
                    </Box>
                ) : (
                    // --- Caso raro: ni content ni PDF ---
                     <Typography sx={{ fontStyle: 'italic', color: 'text.secondary' }}>[No hay contenido disponible para esta noticia]</Typography>
                )}
          {/* --- FIN CONTENIDO --- */}
          {/* --- Contenido --- */}
          {/* Usar dangerouslySetInnerHTML con precaución si viene de un editor WYSIWYG */}
          {/* Si es texto plano, puedes usar Typography o Box */}
          <Box className="news-content" sx={{ '& p': { mb: 2 }, lineHeight: 1.7 }}>
             <Typography component="div" dangerouslySetInnerHTML={{ __html: article.content }} />
             {/* O si es texto plano: <Typography>{article.content}</Typography> */}
          </Box>
       </Paper>

      {/* --- Sección Comentarios --- */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h3" gutterBottom>Comentarios ({comments.length})</Typography>
        {isAuthenticated && (
            <CommentForm articleId={id} onCommentAdded={handleCommentAdded} />
        )}
        {!isAuthenticated && (
            <Typography sx={{ my: 2 }}>Debes iniciar sesión para comentar.</Typography>
        )}

        <Divider sx={{ my: 3 }}/>

        {commentLoading && <CircularProgress size={20} />}
        {commentError && <Alert severity="warning" sx={{ my: 2 }}>{commentError}</Alert>}
        <CommentList
            comments={comments}
            articleId={id}
            onCommentDeleted={handleCommentDeleted}
            />
      </Box>
    </Container>
  );
};

export default NewsDetailPage;