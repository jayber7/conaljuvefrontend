import React, { useState, useEffect, useRef } from 'react';
import { Paper, Box, Typography } from '@mui/material';

const gradients = [
  'linear-gradient(135deg, #003366 0%, #004d99 100%)',
  'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
];

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);
  const animationRef = useRef(null);

  useEffect(() => {
    const target = typeof value === 'number' ? value : 0;
    const start = prevValue.current;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        prevValue.current = target;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [value]);

  return <span>{displayValue}</span>;
};

const StatCard = ({ icon, title, value, gradientIndex = 0 }) => {
  const gradient = gradients[gradientIndex % gradients.length];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        background: '#ffffff',
        border: '1px solid #E2E8F0',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
          borderColor: 'transparent',
        },
      }}
    >
      <Box
        sx={{
          background: gradient,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
          },
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontSize: '1.75rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: '1.75rem' } })}
        </Box>
      </Box>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography
          variant="h2"
          component="div"
          sx={{
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.1,
            mb: 0.5,
            fontSize: '2rem',
          }}
        >
          {value !== null && value !== undefined ? (
            typeof value === 'number' ? <AnimatedNumber value={value} /> : value
          ) : (
            '...'
          )}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#64748B',
            fontWeight: 500,
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {title}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StatCard;
