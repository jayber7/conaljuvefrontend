import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardActionArea, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { format } from 'date-fns'; // Para formatear fechas
import { es } from 'date-fns/locale'; // Para formato en español

// Placeholder si no hay imagen
const placeholderImage = 'https://via.placeholder.com/600x400?text=Noticia';

const NewsCard = ({ article }) => {
  const formattedDate = article.publicationDate
    ? format(new Date(article.publicationDate), 'dd MMMM, yyyy', { locale: es })
    : 'Fecha desconocida';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={RouterLink} to={`/noticia/${article._id}`}>
        <CardMedia
          component="img"
          height="200" // Altura fija para la imagen
          image={article.imageUrl || placeholderImage}
          alt={article.title}
          sx={{ objectFit: 'cover' }} // Para que la imagen cubra el espacio
        />
        <CardContent sx={{ flexGrow: 1 }}> {/* Para que el contenido ocupe espacio */}
          <Typography gutterBottom variant="h6" component="div" sx={{
             display: '-webkit-box',
             overflow: 'hidden',
             WebkitBoxOrient: 'vertical',
             WebkitLineClamp: 2, // Limitar título a 2 líneas
             lineHeight: 1.4, // Ajustar altura de línea
             height: '2.8em' // Altura = lineHeight * lineClamp
          }}>
            {article.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{
             mb: 1,
             display: '-webkit-box',
             overflow: 'hidden',
             WebkitBoxOrient: 'vertical',
             WebkitLineClamp: 3, // Limitar resumen a 3 líneas
             lineHeight: 1.5,
             height: '4.5em' // Altura = lineHeight * lineClamp
          }}>
            {article.summary}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
              <Typography variant="caption" color="text.secondary">
                  {formattedDate}
              </Typography>
              {/* Podrías añadir autor o tags aquí si quieres */}
          </Box>
        </CardContent>
      </CardActionArea>
       {/* Podrías añadir CardActions aquí si necesitas botones fuera del area clickeable */}
    </Card>
  );
};

export default NewsCard;