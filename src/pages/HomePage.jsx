import React, { useState, useEffect, useCallback, RouterLink  } from 'react';
import { Box, Container, Button, Grid, Typography, CircularProgress, Alert, Pagination, Stack, Select, MenuItem, FormControl, InputLabel, Paper } from '@mui/material';
import NewsCard from '../components/News/NewsCard'; // Crear este componente
import api from '../services/api';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

//import bannerConaljuve from '../assets/BannerCONALJUVE.png';
const HomePage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(9); // Noticias por página
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('-publicationDate'); // Orden por defecto
  //const [filterDept, setFilterDept] = useState(''); // Filtro por departamento
  const [filterDeptCode, setFilterDeptCode] = useState(''); // <-- MODIFICADO: Usar código
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
                //'locationScope[department]': filterDept || undefined, // Solo enviar si hay filtro
                 // --- MODIFICACIÓN: Enviar el código numérico del departamento ---
                'locationScope.departmentCode': filterDeptCode || undefined,
                // --- FIN MODIFICACIÓN ---
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
    }, [page, limit, sortBy, filterDeptCode]);


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
          // --- MODIFICADO: Guardar el código numérico ---
    setFilterDeptCode(event.target.value);
    // --- FIN MODIFICACIÓN ---
      setPage(1); // Resetear a página 1 al cambiar filtro
  }

  return (
    <>
       {/* --- BANNER --- 
       <Box
                sx={{
                    width: '100%',
                    height: { xs: 150, sm: 200, md: 250 }, // Altura responsiva
                    mb: 4, // Margen inferior
                    borderRadius: '8px', // Bordes redondeados
                    overflow: 'hidden', // Para que la imagen no se salga si usas objectFit
                    boxShadow: 3, // Sombra ligera
                }}
            >
                <img
                    src={bannerConaljuve}
                    alt="Banner CONALJUVE"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover', // Cubre el contenedor, puede recortar imagen
                        // objectFit: 'contain', // Muestra toda la imagen, puede dejar espacios
                        display: 'block' // Evita espacio extra debajo de la imagen
                    }}
                />
            </Box>
      
      {/* --- TITULO PRINCIPAL --- */}
      <Typography variant="h3" component="h3" sx={{  ml: 2, whiteSpace: 'nowrap' }} >
        Últimas Noticias
      </Typography>
      <Button
                    variant="contained" // O prueba "outlined"
                    color="secondary"    // O "secondary" si quieres destacarlo más
                    component={RouterLink}
                    to="/registro-miembro" // <-- Ruta a tu página de registro de miembro
                    size="medium" // Tamaño normal o "large" si prefieres
                    startIcon={<AddCircleOutlineIcon />} // Icono opcional
                    sx={{  ml: 2, whiteSpace: 'nowrap' }}
                    // Margen superior para separarlo del título
                >
                    Registrarse como Miembro
                </Button>
      {/* --- Filtros y Ordenamiento (Dentro de un Paper) --- */}
      <Paper elevation={1} sx={{ p: 2, mb: 4, bgcolor: 'background.paper' }}> {/* Fondo blanco, sombra ligera */}
          <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md="auto"> {/* 'auto' para que ocupe lo necesario */}
                 <FormControl size="small" fullWidth>
                      <InputLabel id="sort-by-label">Ordenar Por</InputLabel>
                      <Select labelId="sort-by-label" value={sortBy} label="Ordenar Por" onChange={handleSortChange}>
                          <MenuItem value="-publicationDate">Más Recientes</MenuItem>
                          <MenuItem value="publicationDate">Más Antiguas</MenuItem>
                      </Select>
                  </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md="auto">
                   <FormControl size="small" fullWidth>
                      <InputLabel id="filter-dept-label">Departamento</InputLabel>
                      <Select labelId="filter-dept-label" value={filterDeptCode} label="Departamento" onChange={handleFilterChange} >
                          <MenuItem value=""><em>Todos</em></MenuItem>
                          {departments.map(dep => ( <MenuItem key={dep.code} value={dep.code}>{dep.name}</MenuItem> ))}
                      </Select>
                  </FormControl>
              </Grid>
              {/* Podrías añadir más filtros aquí (ej. búsqueda por texto) */}
          </Grid>
       </Paper>


      {/* --- Contenido --- */}
      {loading && ( <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}> <CircularProgress /> </Box> )}
      {error && <Alert severity="error" sx={{ my: 3 }}>{error}</Alert>}
      {!loading && !error && news.length === 0 && ( <Typography sx={{ textAlign: 'center', my: 5, color: 'text.secondary' }}>No se encontraron noticias con los filtros seleccionados.</Typography> )}

      {!loading && !error && news.length > 0 && (
        // Grid con espaciado aumentado
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {news.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article._id}>
              {/* Pasar elevation={0} si quieres quitar la sombra individual y confiar en el hover */}
              <NewsCard article={article} /* elevation={0} */ />
            </Grid>
          ))}
        </Grid>
      )}

      {/* --- Paginación --- */}
      {!loading && !error && totalPages > 1 && (
         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 3 }}> {/* Más margen */}
             <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" shape="rounded" />
         </Box>
      )}
    </>
  );
};
export default HomePage;