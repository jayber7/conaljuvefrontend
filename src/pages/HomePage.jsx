import React, { useState, useEffect, useCallback } from 'react';
import { Box, Container, Grid, Typography, CircularProgress, Alert, Pagination, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import NewsCard from '../components/News/NewsCard'; // Crear este componente
import api from '../services/api';

const HomePage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(9); // Noticias por página
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('-publicationDate'); // Orden por defecto
  const [filterDept, setFilterDept] = useState(''); // Filtro por departamento
  const [departments, setDepartments] = useState([]); // Lista de deptos para el filtro


    // Función para cargar noticias
   const fetchNews = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = {
                page,
                limit,
                sort: sortBy,
                'locationScope[department]': filterDept || undefined, // Solo enviar si hay filtro
            };
            const response = await api.get('/news', { params });
            setNews(response.data.data.news || []);
            setTotalPages(Math.ceil(response.data.totalCount / limit));
        } catch (err) {
            console.error("Error fetching news:", err);
            setError(err.response?.data?.message || 'No se pudieron cargar las noticias.');
            setNews([]); // Limpiar noticias en caso de error
        } finally {
            setLoading(false);
        }
    }, [page, limit, sortBy, filterDept]);


  // Fetch inicial y cuando cambian los filtros/página
  useEffect(() => {
    fetchNews();
  }, [fetchNews]); // fetchNews ya incluye las dependencias correctas

  // Fetch departamentos para el filtro (solo una vez)
  useEffect(() => {
       const fetchDepartments = async () => {
            try {
                // Reutilizar endpoint si existe, o crear uno específico si es necesario
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
      setPage(1); // Resetear a página 1 al cambiar orden
  }

  const handleFilterChange = (event) => {
      setFilterDept(event.target.value);
      setPage(1); // Resetear a página 1 al cambiar filtro
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h1" component="h1" gutterBottom>
        Últimas Noticias
      </Typography>

      {/* --- Filtros y Ordenamiento --- */}
       <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
          <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="sort-by-label">Ordenar Por</InputLabel>
              <Select
                  labelId="sort-by-label"
                  value={sortBy}
                  label="Ordenar Por"
                  onChange={handleSortChange}
              >
                  <MenuItem value="-publicationDate">Más Recientes</MenuItem>
                  <MenuItem value="publicationDate">Más Antiguas</MenuItem>
                  {/* <MenuItem value="title">Título (A-Z)</MenuItem> */}
                  {/* <MenuItem value="-title">Título (Z-A)</MenuItem> */}
              </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="filter-dept-label">Departamento</InputLabel>
              <Select
                  labelId="filter-dept-label"
                  value={filterDept}
                  label="Departamento"
                  onChange={handleFilterChange}
              >
                  <MenuItem value=""><em>Todos</em></MenuItem>
                  {departments.map(dep => (
                      <MenuItem key={dep.id || dep.name} value={dep.name}>{dep.name}</MenuItem>
                  ))}
              </Select>
          </FormControl>
       </Stack>


      {/* --- Contenido --- */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error" sx={{ my: 3 }}>{error}</Alert>}

      {!loading && !error && news.length === 0 && (
          <Typography sx={{ textAlign: 'center', my: 5 }}>No se encontraron noticias.</Typography>
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

      {/* --- Paginación --- */}
      {!loading && !error && totalPages > 1 && (
         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
             <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
             />
         </Box>
      )}
    </Container>
  );
};
export default HomePage;