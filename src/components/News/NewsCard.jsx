import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const placeholderImage = 'https://via.placeholder.com/600x400?text=Noticia';

const NewsCard = ({ article }) => {
  const formattedDate = article.publicationDate
    ? format(new Date(article.publicationDate), 'dd MMM yyyy', { locale: es })
    : 'Fecha desconocida';

  const departmentName = article.locationScope?.department || '';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
          borderColor: 'transparent',
          '& .news-image': {
            transform: 'scale(1.08)',
          },
          '& .read-more-arrow': {
            transform: 'translateX(4px)',
            color: '#003366',
          },
        },
      }}
    >
      <Box
        component={RouterLink}
        to={`/noticia/${article._id}`}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
          <CardMedia
            component="img"
            height="200"
            image={article.imageUrl || placeholderImage}
            alt={article.title}
            className="news-image"
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
            }}
          />
          {departmentName && (
            <Chip
              label={departmentName}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                fontWeight: 600,
                fontSize: '0.7rem',
                color: '#003366',
                borderRadius: '8px',
                height: 24,
              }}
            />
          )}
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: '1.05rem',
              lineHeight: 1.4,
              mb: 1,
              color: '#0F172A',
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              height: '2.8em',
              transition: 'color 0.2s ease',
              '.MuiCard-root:hover &': {
                color: '#003366',
              },
            }}
          >
            {article.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: '#64748B',
              lineHeight: 1.6,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              height: '3.2em',
            }}
          >
            {article.summary}
          </Typography>
          <Box sx={{ mt: 'auto', pt: 1.5, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 500 }}>
                {formattedDate}
              </Typography>
            </Box>
            <ArrowForwardIcon
              className="read-more-arrow"
              sx={{
                fontSize: 18,
                color: '#CBD5E1',
                transition: 'all 0.2s ease',
              }}
            />
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default NewsCard;
