import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Container, Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid'; // Poderosa tabla de MUI X
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../services/api';
import NewsFormModal from '../components/Admin/NewsFormModal'; // Crear este componente
import UserManagement from '../components/Admin/UserManagement'; // <-- Importar componente
import { useAuth } from '../contexts/AuthContext'; // Importar useAuth

const AdminPage = () => {
  const { isAdmin, isStaff } = useAuth(); // Obtener roles
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null); // Para editar
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const navigate = useNavigate();

  const fetchNewsAdmin = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Podrías tener un endpoint específico o pedir todos con un límite alto
      // También podrías querer ver noticias no publicadas aquí
      const response = await api.get('/news?limit=50&sort=-createdAt'); // Ojo: pedir todo si hay mucho puede ser lento
      console.log(response.data.data.news)
      setNews(response.data.data.news || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar noticias para administración.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsAdmin();
  }, [fetchNewsAdmin]);

  // --- Handlers Modales ---
  const handleOpenModal = (newsData = null) => {
    setSelectedNews(newsData); // null para crear, objeto para editar
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedNews(null);
  };
  const handleSaveSuccess = () => {
    handleCloseModal();
    fetchNewsAdmin(); // Recargar la lista después de guardar
  };

  // --- Handlers Delete ---
  const handleOpenDeleteConfirm = (id) => {
    setNewsToDelete(id);
    setDeleteConfirmOpen(true);
  };
  const handleCloseDeleteConfirm = () => {
    setNewsToDelete(null);
    setDeleteConfirmOpen(false);
  };
  const handleDeleteNews = async () => {
    if (!newsToDelete) return;
    setLoadingDelete(true);
    try {
      await api.delete(`/news/${newsToDelete}`);
      handleCloseDeleteConfirm();
      fetchNewsAdmin(); // Recargar lista
    } catch (err) {
       setError(err.response?.data?.message || 'Error al eliminar la noticia.');
       console.error(err);
       setLoadingDelete(false); // Mantener diálogo abierto en error? O cerrarlo?
       // handleCloseDeleteConfirm();
    } finally {
         // setLoadingDelete(false); // Se resetea al cerrar o en error
    }
  };
 

  // --- Columnas para DataGrid ---
  const columns = [
   // { field: '_id', headerName: 'ID', width: 220 },
    {
        field: 'title',
        headerName: 'Título',
        flex: 2, // Ocupa más espacio
        minWidth: 250
    },
    {
        field: 'publicationDate',
        headerName: 'Fecha Pub.',
        width: 130,
        type: 'string',
        valueGetter: (value,row) => {
          return `${row.publicationDate || ''}`;
        },
       
    },
    {
        field: 'author',
        headerName: 'Autor',
        width: 150,
        type:'object',
        valueGetter: (value,row) => {
          return `${row.author.name || ''}`;
        },
        //valueGetter: (params) => (params?.row?.author?.name) || 'Desconocido',
        // valueGetter: (params) => params.row.author?.username || 'Desconocido', // Acceder al nombre poblado
    },
    {
        field: 'isPublished',
        headerName: 'Publicada',
        width: 100,
        type: 'boolean',
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Ver Noticia">
             <IconButton size="small" onClick={() => navigate(`/noticia/${params.id}`)}>
                  <VisibilityIcon fontSize="inherit" />
              </IconButton>
          </Tooltip>
          {/* --- MODIFICACIÓN: Mostrar Editar a Staff/Admin --- */}
          {(isAdmin || isStaff) && (
                 <Tooltip title="Editar Noticia">
                    <IconButton size="small" onClick={() => handleOpenModal(params.row)}>
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                 </Tooltip>
             )}
             {/* --- FIN MODIFICACIÓN --- */}
            {/* --- MODIFICACIÓN: Mostrar Eliminar solo a Admin --- */}
            {isAdmin && (
                <Tooltip title="Eliminar Noticia">
                    <IconButton size="small" color="error" onClick={() => handleOpenDeleteConfirm(params.id)}>
                       <DeleteIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
             )}
             {/* --- FIN MODIFICACIÓN --- */}
        </Box>
      ),
    },
  ];

  return (
    
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h2" component="h1"  sx={{ flexGrow: 1, textAlign: 'center', mr: { xs: 0, sm: 2 } }} >
          Gestionar Noticias
        </Typography>
        {(isAdmin || isStaff) && (
                  <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={() => handleOpenModal(null)}
                  >
                      Añadir Noticia
                  </Button>
               )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ height: 650, width: '100%' }}>
        <DataGrid
          rows={news}
          columns={columns}
          getRowId={(row) => row._id} // Especificar el ID único de la fila
          loading={loading}
          initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: [{ field: 'publicationDate', sort: 'desc' }] } // Orden inicial
          }}
          pageSizeOptions={[5, 10, 25]}
          slots={{ toolbar: GridToolbar }} // Habilitar barra de herramientas (filtros, exportar, etc.)
          slotProps={{
              toolbar: { showQuickFilter: true }, // Activar filtro rápido
          }}
          density="compact" // Tabla más compacta
          // checkboxSelection // Deshabilitar si no se necesita selección múltiple
          disableRowSelectionOnClick
        />
      </Paper>
      
       {/* --- Modal Crear/Editar Noticia --- */}
        <NewsFormModal
            open={modalOpen}
            onClose={handleCloseModal}
            onSaveSuccess={handleSaveSuccess}
            initialData={selectedNews}
        />

        {/* --- Diálogo Confirmar Eliminación --- */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={handleCloseDeleteConfirm}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que quieres eliminar esta noticia? Esta acción no se puede deshacer.
            </DialogContentText>
             {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteConfirm} disabled={loadingDelete}>Cancelar</Button>
            <Button onClick={handleDeleteNews} color="error" autoFocus disabled={loadingDelete}>
               {loadingDelete ? <CircularProgress size={20} /> : 'Eliminar'}
            </Button>
          </DialogActions>
        </Dialog>
        {/* --- SECCIÓN GESTIÓN DE USUARIOS --- */}
        {isAdmin && <UserManagement />}
        {/* --- FIN SECCIÓN --- */}
    </Container>
  );
};

export default AdminPage;