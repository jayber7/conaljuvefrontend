import React from 'react';
import { Box, Skeleton, Grid } from '@mui/material';

export const NewsCardSkeleton = () => (
  <Box
    sx={{
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #E2E8F0',
      bgcolor: '#ffffff',
    }}
  >
    <Skeleton variant="rectangular" height={200} sx={{ bgcolor: '#F1F5F9' }} />
    <Box sx={{ p: 2.5 }}>
      <Skeleton variant="text" height={28} width="90%" sx={{ mb: 1, bgcolor: '#F1F5F9' }} />
      <Skeleton variant="text" height={28} width="60%" sx={{ mb: 2, bgcolor: '#F1F5F9' }} />
      <Skeleton variant="text" height={16} width="80%" sx={{ mb: 1, bgcolor: '#F1F5F9' }} />
      <Skeleton variant="text" height={16} width="50%" sx={{ bgcolor: '#F1F5F9' }} />
      <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between' }}>
        <Skeleton variant="text" width={80} height={16} sx={{ bgcolor: '#F1F5F9' }} />
        <Skeleton variant="circular" width={18} height={18} sx={{ bgcolor: '#F1F5F9' }} />
      </Box>
    </Box>
  </Box>
);

export const NewsGridSkeleton = ({ count = 6 }) => (
  <Grid container spacing={3}>
    {Array.from(new Array(count)).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <NewsCardSkeleton />
      </Grid>
    ))}
  </Grid>
);

export const StatCardSkeleton = () => (
  <Box
    sx={{
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #E2E8F0',
      bgcolor: '#ffffff',
    }}
  >
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
      <Skeleton variant="circular" width={56} height={56} sx={{ bgcolor: '#F1F5F9' }} />
    </Box>
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Skeleton variant="text" width={60} height={48} sx={{ mx: 'auto', bgcolor: '#F1F5F9' }} />
      <Skeleton variant="text" width={100} height={16} sx={{ mx: 'auto', bgcolor: '#F1F5F9' }} />
    </Box>
  </Box>
);

export const StatsGridSkeleton = () => (
  <Grid container spacing={3}>
    {Array.from(new Array(4)).map((_, index) => (
      <Grid item xs={6} md={3} key={index}>
        <StatCardSkeleton />
      </Grid>
    ))}
  </Grid>
);
