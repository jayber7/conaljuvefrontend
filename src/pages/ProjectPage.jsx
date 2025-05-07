// src/pages/ProjectPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Container, Paper, CircularProgress, Alert, IconButton, Tooltip, Chip  } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../services/api';
import ProjectFormModal from '../components/Projects/ProjectFormModal'; // <-- Crear este modal
import { useAuth } from '../contexts/AuthContext'; // Para permisos
// Opcional: Diálogo de confirmación para borrar
// import DeleteConfirmDialog from '../components/Admin/DeleteConfirmDialog';

const ProjectPage = () => {
    const { isAdmin, isStaff } = useAuth(); // Para control de botones/acciones
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null); // Para editar
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRowCount, setTotalRowCount] = useState(0);
    //const [ModalOpen, setIsModalOpen]=useState(null);
   // console.log(`Proyectos obtenidos por agregación: ${JSON.stringify(projects, null, 2)}`);

    // Estados para filtros (si los añades encima de la tabla)
    // const [filterStatus, setFilterStatus] = useState('');
    // const [filterDepartment, setFilterDepartment] = useState('');

    // Fetch Proyectos
    // Fetch Proyectos (ahora espera que el backend devuelva los nombres)
    const fetchProjects = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const params = {
                page: paginationModel.page + 1,
                limit: paginationModel.pageSize,
                sort: '-startDate',
                // status: filterStatus || undefined, // Mantener si tienes filtro por status
            };
             Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
            const response = await api.get('/projects', { params });
            setProjects(response.data.data.projects || []);
            setTotalRowCount(response.data.totalCount || 0);
        } catch (err) { setError(err.response?.data?.message || 'Error al cargar proyectos.'); console.error(err); }
        finally { setLoading(false); }
    }, [paginationModel /*, filterStatus */]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Handlers Modal y Delete (sin cambios)
// --- HANDLERS MODAL COMPLETOS ---
const handleOpenModal = (projectData = null) => {
    console.log("Abriendo modal para:", projectData ? `Editar Proyecto ID: ${projectData._id}` : "Crear Nuevo Proyecto");
    setSelectedProject(projectData); // null para crear, objeto de proyecto para editar
    setIsModalOpen(true);         // Abrir el modal
};

const handleCloseModal = () => {
    console.log("Cerrando modal de proyecto.");
    setIsModalOpen(false);        // Cerrar el modal
    setSelectedProject(null);     // Limpiar datos del proyecto seleccionado
    setError('');                 // Limpiar errores del modal si los hubiera (opcional)
};

const handleSaveSuccess = () => {
    console.log("Proyecto guardado/actualizado exitosamente.");
    handleCloseModal();           // Cerrar modal
    fetchProjects();              // Recargar la lista de proyectos
};
// --- FIN HANDLERS MODAL ---
    // ... (handlers delete si los tienes) ...

    // --- Columnas DataGrid Proyectos (SIMPLIFICADAS) ---
    const columns = [
        {
            field: 'projectName',
            headerName: 'Nombre del Proyecto',
            flex: 1, minWidth: 250
        },
        {
            // --- Acceder directamente al nombre poblado ---
            field: 'departmentName',
            headerName: 'Departamento',
            width: 150,
            // valueGetter como fallback simple si el nombre no viniera (aunque no debería pasar)
            //valueGetter: (params) => params.departmentName ?? 'N/A',            // --- Fin ---
            //valueGetter: (value, row) => `${row}`,
            valueGetter: (value, row) => row.location.departmentName,
            //valueGetter: (params) => params.row?.location?.departmentName ?? 'N/A',

        },
        // Si quieres mostrar Provincia y Municipio, el backend debe poblarlos y tú añades:
        { field: 'provinceName', headerName: 'Provincia', width: 150, valueGetter: (value,row) => row.location.provinceName },
        { field: 'municipalityName', headerName: 'Municipio', width: 150, valueGetter: (value,row) => row.location.municipalityName },
        {
            field: 'status',
            headerName: 'Estado',
            width: 130,
            // Puedes usar un renderCell simple si el backend devuelve el string 'PLANIFICADO', etc.
            // O un renderCell con Chip si quieres colores (necesitarías un statusMap simple)
            renderCell: (params) => <Chip label={params.value || 'Desconocido'} size="small" variant="outlined" />
        },
         {
            field: 'startDate', headerName: 'Inicio', width: 110,  type: 'date',
            valueGetter: (params) => params? new Date(params) : null,
           //renderCell: (params) => params? format(params, 'dd/MM/yy', { locale: es }) : ''
       },
         {
            field: 'endDate', headerName: 'Fin', width: 110, type: 'date',
            valueGetter: (params) => params? new Date(params) : null,
            //renderCell: (params) => params? format(params, 'dd/MM/yy', { locale: es }) : ''
       },
        {
            // --- Acceder directamente al nombre poblado ---
            field: 'createdBy',
            headerName: 'Registrado por',
            width: 150,
            valueGetter: (params) => params.name ?? 'Desconocido',
            // --- Fin ---
        },
        //Acciones (Editar/Borrar) - Condicionales por rol
        {
            field: 'actions', headerName: 'Acciones', width: 100, sortable: false, filterable: false,
            renderCell: (params) => (
            <Box>
                {(isAdmin || isStaff) && ( 
                <Tooltip title="Editar Proyecto">
                    <IconButton size="small" onClick={() => handleOpenModal(params.row)}>
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
                )}
                {isAdmin && ( 
                    <Tooltip title="Eliminar Proyecto">
                        <IconButton size="small" color="error" /*onClick={() => handleOpenDeleteConfirm(params.id)}*/>
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
            ),
        },
    ];
  
       
 


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <Container maxWidth="xl" sx={{ py: 4 }}> {/* Usar xl para tabla ancha */}
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h1" component="h1">
                    Proyectos Vecinales
                </Typography>
                 {/* Botón Añadir visible para Staff/Admin */}
                {(isAdmin || isStaff) && (
                     <Button
                        variant="contained" color="secondary"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => handleOpenModal(null)} // null para crear
                     >
                         Registrar Proyecto
                     </Button>
                 )}
            </Box>

             {/* Aquí puedes añadir los filtros si los implementas */}
             {/* <Paper sx={{p: 2, mb: 3}} variant="outlined"> ... Filtros ... </Paper> */}

            {/* {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>} */}

             <Paper sx={{ height: 700, width: '100%' }} variant="outlined">
                 <DataGrid
                     rows={projects}
                    columns={columns}
                    getRowId={(row) => row._id}
                    //  loading={loading}
                    //  paginationMode="server"
                    //  rowCount={totalRowCount}
                    //  pageSizeOptions={[10, 25, 50]}
                    //  paginationModel={paginationModel}
                    //  onPaginationModelChange={setPaginationModel} // Cambiado para actualizar directo
                    //  slots={{ toolbar: GridToolbar }}
                    //  slotProps={{ toolbar: { showQuickFilter: true } }}
                    //  density="compact"
                    //  disableRowSelectionOnClick
                    //  disableVirtualization 
                 />
             </Paper>

            {/* Modal para Crear/Editar */}
             <ProjectFormModal
                 open={modalOpen}
                 onClose={handleCloseModal}
                 onSaveSuccess={handleSaveSuccess}
                 initialData={selectedProject}
             />

             {/* Modal Confirmar Borrado (Opcional) */}
             {/* <DeleteConfirmDialog open={deleteConfirmOpen} ... /> */}

        </Container>
    </LocalizationProvider>
    );
};
const statusMap = {
    PLANIFICADO: { label: 'Planificado', color: 'info', /* icon: ... */ },
    EN_EJECUCION: { label: 'En Ejecución', color: 'primary', /* icon: ... */ },
    COMPLETADO: { label: 'Completado', color: 'success', /* icon: ... */ },
    CANCELADO: { label: 'Cancelado', color: 'error', /* icon: ... */ },
    SUSPENDIDO: { label: 'Suspendido', color: 'warning', /* icon: ... */ },
};
export default ProjectPage;