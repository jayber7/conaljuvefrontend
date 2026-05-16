import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Button, Grid, Typography, Alert, Pagination, Select, MenuItem, FormControl, InputLabel, Paper, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NewsCard from '../components/News/NewsCard';
import StatCard from '../components/Home/StatCard';
import { NewsGridSkeleton, StatsGridSkeleton } from '../components/Skeletons/NewsCardSkeleton';
import api from '../services/api';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';
import GroupsIcon from '@mui/icons-material/Groups';
import CampaignIcon from '@mui/icons-material/Campaign';

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('-publicationDate');
  const [filterDeptCode, setFilterDeptCode] = useState('');
  const [departments, setDepartments] = useState([]);
  const [stats, setStats] = useState({
    totalMemberCount: null,
    verifiedMemberCount: null,
    newsCount: null,
    projectCount: null
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true); setErrorStats('');
      try {
        const response = await api.get('/stats/summary');
        setStats(response.data.data || { totalMemberCount: 0, verifiedMemberCount: 0, newsCount: 0, projectCount: 0 });
      } catch (err) {
        console.error("Error fetching stats:", err);
        setErrorStats("No se pudieron cargar las estadísticas.");
        setStats({ totalMemberCount: 'N/A', verifiedMemberCount: 'N/A', newsCount: 'N/A', projectCount: 'N/A' });
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page,
        limit,
        sort: sortBy,
        'locationScope.departmentCode': filterDeptCode || undefined,
      };
      const response = await api.get('/news', { params });
      setNews(response.data.data.news || []);
      setTotalPages(Math.ceil(response.data.totalCount / limit));
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err.response?.data?.message || 'No se pudieron cargar las noticias.');
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, filterDeptCode]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('/locations/departments');
        setDepartments(response.data.data.departments || []);
      } catch (err) { console.error("Error fetching departments for filter:", err); }
    };
    fetchDepartments();
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1);
  }

  const handleFilterChange = (event) => {
    setFilterDeptCode(event.target.value);
    setPage(1);
  }

  const quickAccessItems = [
    { icon: <PeopleIcon />, title: 'Federaciones', subtitle: 'Departamentales y Municipales', path: '/federaciones/dptales/lp', gradient: 'linear-gradient(135deg, #003366 0%, #004d99 100%)' },
    { icon: <GroupsIcon />, title: 'Comités', subtitle: 'Juventud, Mujeres, Salud', path: '/comites/juventud', gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' },
    { icon: <CampaignIcon />, title: 'Tribunales', subtitle: 'Electoral y Disciplinario', path: '/tribunales', gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' },
  ];

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #003366 0%, #004d99 50%, #0066cc 100%)',
          position: 'relative',
          overflow: 'hidden',
          mb: 5,
          borderRadius: '20px',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.2) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            py: { xs: 6, md: 8 },
            px: { xs: 3, md: 6 },
            textAlign: 'center',
          }}
        >
          <Chip
            label="Plataforma Digital Oficial"
            sx={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              fontWeight: 600,
              mb: 3,
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          />
          <Typography
            variant="h1"
            component="h1"
            sx={{
              color: '#ffffff',
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem' },
              mb: 2,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            La Voz de las Juntas Vecinales<br />
            <Box component="span" sx={{ color: '#F59E0B' }}>de Bolivia</Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '600px',
              mx: 'auto',
              mb: 4,
              fontSize: { xs: '1rem', md: '1.15rem' },
              lineHeight: 1.7,
              fontWeight: 400,
            }}
          >
            Conectando comunidades, fortaleciendo la democracia participativa y construyendo el futuro juntos.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="secondary"
              component={RouterLink}
              to="/registro-miembro"
              size="large"
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                borderRadius: '12px',
                fontWeight: 700,
              }}
            >
              Registrarse como Miembro
            </Button>
            <Button
              variant="outlined"
              component={RouterLink}
              to="/sobre-conaljuve"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                borderRadius: '12px',
                fontWeight: 700,
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.4)',
                '&:hover': {
                  borderColor: '#ffffff',
                  background: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Conocer Más
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Quick Access Cards */}
      <Box sx={{ mb: 5 }}>
        <Grid container spacing={3}>
          {quickAccessItems.map((item, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Paper
                component={RouterLink}
                to={item.path}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  background: item.gradient,
                  color: '#ffffff',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: 'none',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.25, color: '#ffffff' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, color: '#ffffff' }}>
                    {item.subtitle}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: '#0F172A',
            textAlign: 'center',
          }}
        >
          Nuestra Comunidad en Números
        </Typography>
        {loadingStats && <StatsGridSkeleton />}
        {errorStats && <Alert severity="warning" sx={{ mb: 2 }}>{errorStats}</Alert>}
        {!loadingStats && !errorStats && (
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <StatCard icon={<PeopleIcon />} title="Miembros Registrados" value={stats.totalMemberCount} gradientIndex={0} />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard icon={<VerifiedUserIcon />} title="Miembros Verificados" value={stats.verifiedMemberCount} gradientIndex={1} />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard icon={<ArticleIcon />} title="Noticias Publicadas" value={stats.newsCount} gradientIndex={2} />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard icon={<AssignmentIcon />} title="Proyectos Activos" value={stats.projectCount} gradientIndex={3} />
            </Grid>
          </Grid>
        )}
      </Box>

      {/* News Section */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h3" component="h2" sx={{ fontWeight: 700, color: '#0F172A' }}>
            Últimas Noticias
          </Typography>
          <Paper elevation={0} sx={{ p: 1.5, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Ordenar Por</InputLabel>
              <Select value={sortBy} label="Ordenar Por" onChange={handleSortChange}>
                <MenuItem value="-publicationDate">Más Recientes</MenuItem>
                <MenuItem value="publicationDate">Más Antiguas</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Departamento</InputLabel>
              <Select value={filterDeptCode} label="Departamento" onChange={handleFilterChange}>
                <MenuItem value=""><em>Todos</em></MenuItem>
                {departments.map(dep => (<MenuItem key={dep.code} value={dep.code}>{dep.name}</MenuItem>))}
              </Select>
            </FormControl>
          </Paper>
        </Box>

        {loading && <NewsGridSkeleton count={6} />}
        {error && <Alert severity="error" sx={{ my: 3 }}>{error}</Alert>}
        {!loading && !error && news.length === 0 && (
          <Typography sx={{ textAlign: 'center', my: 5, color: 'text.secondary' }}>
            No se encontraron noticias con los filtros seleccionados.
          </Typography>
        )}

        {!loading && !error && news.length > 0 && (
          <Grid container spacing={3}>
            {news.map((article) => (
              <Grid item xs={12} sm={6} md={4} key={article._id}>
                <NewsCard article={article} />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && !error && totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 3 }}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" shape="rounded" />
          </Box>
        )}
      </Box>
    </>
  );
};

export default HomePage;
