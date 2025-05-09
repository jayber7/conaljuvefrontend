// src/components/Admin/TribunalManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Box, Typography, Button, CircularProgress, Alert, Paper, IconButton, Tooltip, Chip, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../services/api';
import TribunalFormModal from './TribunalFormModal'; // Importar el modal
// Opcional: Diálogo de confirmación
// import DeleteConfirmDialog from './DeleteConfirmDialog';

// Definir niveles para filtro (coincidir con el enum del backend)
const tribunalLevels = ['DEPARTAMENTAL', 'MUNICIPAL', 'VECINAL'];

const TribunalManagement = () => {
    const [tribunals, setTribunals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTribunal, setSelectedTribunal] = useState(null); // Para editar
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRowCount, setTotalRowCount] = useState(0);
    const [filterLevel, setFilterLevel] = useState('');
    const [filterLocationName, setFilterLocationName] = useState('');

    // Fetch Tribunales
    const fetchTribunals = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const params = {
                page: paginationModel.page + 1,
                limit: paginationModel.pageSize,
                sort: 'level locationName',
                level: filterLevel || undefined,
                locationName: filterLocationName || undefined, // Búsqueda simple por nombre
            };
            Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
            const response = await api.get('/tribunals', { params });
            setTribunals(response.data.data.tribunals || []);
            setTotalRowCount(response.data.totalCount || 0);
        } catch (err) { setError(err.response?.data?.message || 'Error al cargar tribunales.'); console.error(err); }
        finally { setLoading(false); }
    }, [paginationModel, filterLevel, filterLocationName]);

    useEffect(() => {
        fetchTribunals();
    }, [fetchTribunals]);

    // Handlers Modal
    const handleOpenModal = (tribunalData = null) => { setSelectedTribunal(tribunalData); setModalOpen(true); };
    const handleCloseModal = () => { setModalOpen(false); setSelectedTribunal(null); };
    const handleSaveSuccess = () => { handleCloseModal(); fetchTribunals(); };

    // Handlers Delete (Implementar si es necesario con confirmación)
    // const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    // const [tribunalToDelete, setTribunalToDelete] = useState(null);
    // const handleOpenDeleteConfirm = (id) => { /* ... */ };
    // const handleCloseDeleteConfirm = () => { /* ... */ };
    // const handleDeleteTribunal = async () => { /* ... api.delete(`/tribunals/${tribunalToDelete}`) ... fetchTribunals() ... */ };


    // Columnas DataGrid Tribunales
    const columns = [
        { field: 'level', headerName: 'Nivel', width: 150 },
        { field: 'locationName', headerName: 'Ubicación (Nombre)', flex: 1, minWidth: 200 },
        {
            field: 'directory', headerName: 'Presidente/a', width: 200, sortable: false,
            valueGetter: (params) => {
                const president = params.row?.directory?.find(m => m.role?.toLowerCase().includes('presidente'));
                return president?.fullName || (params.row?.directory?.length ? `${params.row.directory.length} miembro(s)` : 'N/A');
            }
        },
         {
            field: 'termStartDate', headerName: 'Inicio Gestión', width: 120, type: 'date',
            valueGetter: (params) => params.value ? new Date(params.value) : null,
            renderCell: (params) => params.value ? format(params.value, 'dd/MM/yy', { locale: es }) : ''
        },
         {
            field: 'termEndDate', headerName: 'Fin Gestión', width: 120, type: 'date',
            valueGetter: (params) => params.value ? new Date(params.value) : null,
            renderCell: (params) => params.value ? format(params.value, 'dd/MM/yy', { locale: es }) : ''
        },
        { field: 'isActive', headerName: 'Activo', width: 90, type: 'boolean'},
        {
            field: 'actions', headerName: 'Acciones', width: 100, sortable: false, filterable: false,
            renderCell: (params) => (
              <Box>
                 <Tooltip title="Editar Tribunal">
                    <IconButton size="small" onClick={() => handleOpenModal(params.row)}>
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                 </Tooltip>
                 <Tooltip title="Eliminar Tribunal">
                      <IconButton size="small" color="error" /* onClick={() => handleOpenDeleteConfirm(params.id)} */ >
                         <DeleteIcon fontSize="inherit" />
                      </IconButton>
                  </Tooltip>
              </Box>
            ),
          },
    ];

    return (
        <Box> {/* Quitar mt={4} si está dentro de un TabPanel con padding */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h2">
                    Gestión de Tribunales de Honor
                </Typography>
                 <Button
                    variant="contained" color="secondary"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => handleOpenModal(null)}
                 >
                     Añadir Tribunal
                 </Button>
            </Box>

            {/* --- Filtros --- */}
            <Paper sx={{ p: 2, mb: 3 }} variant="outlined">
                <Grid container spacing={2}>
                     <Grid item xs={12} sm={6} md={4}>
                         <FormControl fullWidth size="small">
                            <InputLabel>Filtrar por Nivel</InputLabel>
                            <Select value={filterLevel} label="Filtrar por Nivel" onChange={(e) => { setFilterLevel(e.target.value); setPaginationModel(p => ({...p, page: 0})); }}>
                                <MenuItem value=""><em>Todos</em></MenuItem>
                                {tribunalLevels.map(level => <MenuItem key={level} value={level}>{level.charAt(0) + level.slice(1).toLowerCase()}</MenuItem>)}
                             </Select>
                         </FormControl>
                     </Grid>
                     <Grid item xs={12} sm={6} md={8}>
                         <TextField fullWidth size="small" label="Filtrar por Nombre Ubicación" value={filterLocationName} onChange={(e) => setFilterLocationName(e.target.value)} />
                         {/* Añadir botón "Buscar" si no quieres buscar en cada tecleo */}
                     </Grid>
                 </Grid>
            </Paper>


            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ height: 600, width: '100%' }} variant="outlined">
                <DataGrid
                    rows={tribunals}
                    columns={columns}
                    getRowId={(row) => row._id}
                    loading={loading}
                    paginationMode="server"
                    rowCount={totalRowCount}
                    pageSizeOptions={[10, 25, 50]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: false } }} // Desactivar quick filter si no filtra server-side
                    density="compact"
                    disableRowSelectionOnClick
                />
            </Paper>

            {/* --- Modal Crear/Editar Tribunal --- */}
             <TribunalFormModal
                 open={modalOpen}
                 onClose={handleCloseModal}
                 onSaveSuccess={handleSaveSuccess}
                 initialData={selectedTribunal}
                 // Pasar listas de ubicación si el modal las necesita para selects
                 // departments={departments}
                 // provinces={provinces}
                 // municipalities={municipalities}
             />

            {/* --- Modal Confirmar Borrado (Opcional) --- */}
             {/* <DeleteConfirmDialog open={deleteConfirmOpen} ... /> */}
        </Box>
    );
};

export default TribunalManagement;