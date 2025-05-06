// src/components/Admin/MemberManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Grid, Box, Typography, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel, Tooltip, IconButton, Chip, Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import BlockIcon from '@mui/icons-material/Block'; // Para Rechazado/Inactivo
import EditIcon from '@mui/icons-material/Edit'; // Para editar (opcional)
import DeleteIcon from '@mui/icons-material/Delete'; // Para eliminar (opcional)
import { ListItemIcon } from '@mui/material';
import { ListItemText } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../services/api';

// Mapeo de estados a colores/iconos para Chip
const statusMap = {
    PENDING: { label: 'Pendiente', color: 'warning', icon: <HourglassEmptyIcon fontSize="small"/> },
    VERIFIED: { label: 'Verificado', color: 'success', icon: <CheckCircleIcon fontSize="small"/> },
    REJECTED: { label: 'Rechazado', color: 'error', icon: <CancelIcon fontSize="small"/> },
    INACTIVE: { label: 'Inactivo', color: 'default', icon: <BlockIcon fontSize="small"/> },
};

const MemberManagement = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [totalRowCount, setTotalRowCount] = useState(0);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState({}); // { memberCode: true }

    // --- ESTADOS PARA FILTROS ---
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');
    const [filterProvince, setFilterProvince] = useState('');
    const [filterMunicipality, setFilterMunicipality] = useState('');
    const [filterZone, setFilterZone] = useState('');
    const [filterBarrio, setFilterBarrio] = useState('');
     // --- ESTADOS PARA DATOS DE UBICACIÓN (para los Selects) ---
     const [departments, setDepartments] = useState([]);
     const [provinces, setProvinces] = useState([]);
     const [municipalities, setMunicipalities] = useState([]);
     const [loadingLocationFilters, setLoadingLocationFilters] = useState({ dep: false, prov: false, mun: false });

     // --- Cargar Datos de Ubicación para Filtros ---
    useEffect(() => { // Cargar Departamentos al montar
        const fetchDepartments = async () => {
            setLoadingLocationFilters(prev => ({ ...prev, dep: true }));
            try {
                const res = await api.get('/locations/departments');
                setDepartments(res.data.data.departments || []);
            } catch (err) { console.error("Error loading departments for filter:", err); }
            finally { setLoadingLocationFilters(prev => ({ ...prev, dep: false })); }
        };
        fetchDepartments();
    }, []);

    useEffect(() => { // Cargar Provincias al seleccionar Departamento
        if (filterDepartment) {
            const fetchProvs = async () => {
                setLoadingLocationFilters(prev => ({ ...prev, prov: true }));
                setProvinces([]); setMunicipalities([]); // Limpiar
                setFilterProvince(''); setFilterMunicipality(''); // Resetear selects dependientes
                try {
                    const res = await api.get(`/locations/provinces?departmentCode=${filterDepartment}`);
                    setProvinces(res.data.data.provinces || []);
                } catch (err) { console.error("Error loading provinces for filter:", err); setProvinces([]);}
                finally { setLoadingLocationFilters(prev => ({ ...prev, prov: false })); }
            };
            fetchProvs();
        } else {
            setProvinces([]); setMunicipalities([]);
             setFilterProvince(''); setFilterMunicipality('');
        }
    }, [filterDepartment]); // Depender del filtro de departamento

    useEffect(() => { // Cargar Municipios al seleccionar Provincia
        if (filterProvince) {
             const fetchMuns = async () => {
                setLoadingLocationFilters(prev => ({ ...prev, mun: true }));
                setMunicipalities([]); // Limpiar
                setFilterMunicipality(''); // Resetear select
                try {
                    const res = await api.get(`/locations/municipalities?provinceCode=${filterProvince}`);
                    setMunicipalities(res.data.data.municipalities || []);
                } catch (err) { console.error("Error loading municipalities for filter:", err); setMunicipalities([]);}
                finally { setLoadingLocationFilters(prev => ({ ...prev, mun: false })); }
             };
             fetchMuns();
        } else {
             setMunicipalities([]);
              setFilterMunicipality('');
        }
    }, [filterProvince]); // Depender del filtro de provincia
    // --- Fin Carga Ubicación ---


    // --- Fetch Miembros (Incluir Filtros) ---
    const fetchMembers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = {
                page: paginationModel.page + 1,
                limit: paginationModel.pageSize,
                sort: '-createdAt',
                // Añadir filtros si tienen valor
                status: filterStatus || undefined,
                'location.departmentCode': filterDepartment || undefined,
                'location.provinceCode': filterProvince || undefined,
                'location.municipalityCode': filterMunicipality || undefined,
                'location.zone': filterZone || undefined,
                'location.barrio': filterBarrio || undefined,
            };
            // Limpiar parámetros undefined
            Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

            console.log("Fetching members with params:", params); // DEBUG
            const response = await api.get('/members', { params });
            setMembers(response.data.data.members || []);
            setTotalRowCount(response.data.totalCount || 0);
        } catch (err) { /* ... manejo error ... */ }
        finally { setLoading(false); }
    }, [paginationModel, filterStatus, filterDepartment, filterProvince, filterMunicipality, filterZone, filterBarrio]); // <-- Añadir dependencias de filtro

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);
    // --- Fin Fetch Miembros ---


    // --- Handlers de Filtro ---
    const handleFilterChange = (setter) => (event) => {
        setter(event.target.value);
        setPaginationModel(prev => ({ ...prev, page: 0 })); // Resetear paginación
    };
    const handleTextFilterChange = (setter) => (event) => {
         setter(event.target.value);
         // Opcional: Añadir debounce para no buscar en cada tecla
         // clearTimeout(filterTimeoutRef.current);
         // filterTimeoutRef.current = setTimeout(() => {
         //     setPaginationModel(prev => ({ ...prev, page: 0 }));
         // }, 500); // Esperar 500ms después de dejar de escribir
    };
     const applyTextFilters = () => {
         setPaginationModel(prev => ({ ...prev, page: 0 }));
         // fetchMembers se disparará por el cambio en paginationModel o directamente
         fetchMembers(); // Forzar fetch si no cambias paginación
     };
    const clearLocationFilters = () => {
        setFilterDepartment('');
        setFilterProvince('');
        setFilterMunicipality('');
        setFilterZone('');
        setFilterBarrio('');
         setProvinces([]); // Limpiar listas dependientes
         setMunicipalities([]);
        setPaginationModel(prev => ({ ...prev, page: 0 }));
    };
    // --- Fin Handlers Filtro ---

    const handlePaginationModelChange = (newModel) => {
        setPaginationModel(newModel);
    };

    const handleStatusChange = async (code, newStatus) => {
         setIsUpdatingStatus(prev => ({ ...prev, [code]: true }));
         setError(''); // Limpiar errores previos
        try {
            await api.put(`/members/${code}/status`, { status: newStatus });
            // Refrescar SOLO la fila afectada o toda la tabla
            // Opción A: Actualizar estado local (más rápido visualmente)
             setMembers(prevMembers =>
                 prevMembers.map(member =>
                     member.registrationCode === code ? { ...member, status: newStatus } : member
                 )
             );
             // Opción B: Volver a llamar a fetchMembers() para datos frescos del servidor
             // fetchMembers();
        } catch (err) {
             setError(err.response?.data?.message || `Error al actualizar estado para ${code}.`);
             console.error(err);
        } finally {
             setIsUpdatingStatus(prev => ({ ...prev, [code]: false }));
        }
    };

    // --- Columnas para DataGrid de Miembros ---
    const columns = [
        { field: 'registrationCode', headerName: 'Código Reg.', width: 150 },
        { field: 'fullName', headerName: 'Nombre Completo', flex: 1, minWidth: 200 },
        {
            field: 'idCard', headerName: 'CI', width: 120,
            valueGetter: (params) => {
                // Verificar si params.row existe
                if (!params.row) {
                    return ''; // O 'N/A' si row no existe
                }
                // Acceder a las propiedades de forma segura con ?.
                const number = params.row.idCard ?? ''; // Usar ?? para manejar null/undefined
                const extension = params.row.idCardExtension ?? ''; // Usar ??
                // Devolver combinado solo si hay número
                return number ? `${number} ${extension}`.trim() : ''; // Devuelve '' si no hay número
            }
        },
        { field: 'neighborhoodCouncilName', headerName: 'Junta Vecinal', flex: 1, minWidth: 180 },
        { field: 'memberRoleInCouncil', headerName: 'Cargo', width: 150 },
        {
            field: 'status',
            headerName: 'Estado',
            width: 180, // Más ancho para Select
            renderCell: (params) => {
                const currentStatus = params.value || 'PENDING';
                const code = params.row.registrationCode;
                const isLoading = isUpdatingStatus[code];
                const statusInfo = statusMap[currentStatus] || statusMap.PENDING;

                return (
                    <FormControl variant="standard" size="small" fullWidth disabled={isLoading}>
                        <Select
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(code, e.target.value)}
                            renderValue={(value) => ( // Renderizar Chip dentro del Select
                                <Chip
                                    icon={isLoading ? <CircularProgress size={14} color="inherit"/> : statusInfo.icon}
                                    label={isLoading ? "Guardando..." : statusInfo.label}
                                    color={statusInfo.color}
                                    size="small"
                                    variant="outlined"
                                    sx={{ width: '100%' }}
                                />
                            )}
                            sx={{ '& .MuiSelect-select': { p: 0.5 }, '& fieldset': {border: 'none'}, '& .MuiSelect-icon': { mr: -1 }}} // Estilos para ajustar
                            MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }} // Limitar altura menú
                        >
                           {Object.entries(statusMap).map(([key, value]) => (
                                <MenuItem key={key} value={key}>
                                    <ListItemIcon sx={{minWidth: 32}}>{value.icon}</ListItemIcon>
                                    <ListItemText primary={value.label} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            }
        },
         {
            field: 'registrationDate', headerName: 'Fecha Reg.', width: 130, type: 'dateTime',
            valueGetter: (params) => params.value ? new Date(params.value) : null,
            renderCell: (params) => params.value ? format(params.value, 'dd/MM/yy HH:mm', { locale: es }) : 'N/A',
        },
        // Opcional: Columna de Acciones (Editar, Borrar)
        // {
        //   field: 'actions', headerName: 'Acciones', width: 100, sortable: false, filterable: false,
        //   renderCell: (params) => ( <Box> <IconButton size="small"><EditIcon /></IconButton> <IconButton size="small" color="error"><DeleteIcon /></IconButton> </Box> ),
        // },
    ];

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h2">
                    Gestión de Registros de Miembros
                </Typography>
                {/* --- SECCIÓN DE FILTROS --- */}
            <Paper sx={{ p: 2, mb: 3 }} variant="outlined">
                <Typography variant="h6" gutterBottom>Filtros</Typography>
                <Grid container spacing={2} alignItems="flex-end">
                    {/* Fila 1: Estado y Departamento */}
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl size="small" fullWidth>
                           <InputLabel>Estado</InputLabel>
                           <Select value={filterStatus} label="Estado" onChange={handleFilterChange(setFilterStatus)}>
                               <MenuItem value=""><em>Todos</em></MenuItem>
                               {Object.entries(statusMap).map(([key, value]) => ( <MenuItem key={key} value={key}>{value.label}</MenuItem> ))}
                           </Select>
                       </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl size="small" fullWidth disabled={loadingLocationFilters.dep}>
                           <InputLabel>Departamento</InputLabel>
                           <Select value={filterDepartment} label="Departamento" onChange={handleFilterChange(setFilterDepartment)}>
                               <MenuItem value=""><em>Todos</em></MenuItem>
                               {departments.map(d => ( <MenuItem key={d.code} value={d.code}>{d.name}</MenuItem> ))}
                           </Select>
                       </FormControl>
                    </Grid>
                    {/* Fila 2: Provincia y Municipio */}
                    <Grid item xs={12} sm={6} md={3}>
                         <FormControl size="small" fullWidth disabled={!filterDepartment || loadingLocationFilters.prov}>
                            <InputLabel>Provincia</InputLabel>
                            <Select value={filterProvince} label="Provincia" onChange={handleFilterChange(setFilterProvince)}>
                                <MenuItem value=""><em>Todas</em></MenuItem>
                                {provinces.map(p => ( <MenuItem key={p.code} value={p.code}>{p.name}</MenuItem> ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                         <FormControl size="small" fullWidth disabled={!filterProvince || loadingLocationFilters.mun}>
                            <InputLabel>Municipio</InputLabel>
                            <Select value={filterMunicipality} label="Municipio" onChange={handleFilterChange(setFilterMunicipality)}>
                                <MenuItem value=""><em>Todos</em></MenuItem>
                                {municipalities.map(m => ( <MenuItem key={m.code} value={m.code}>{m.name}</MenuItem> ))}
                             </Select>
                         </FormControl>
                    </Grid>
                    {/* Fila 3: Zona y Barrio */}
                     <Grid item xs={12} sm={6} md={4}>
                         <TextField
                            size="small" fullWidth label="Filtrar por Zona"
                            value={filterZone}
                            onChange={handleTextFilterChange(setFilterZone)}
                            // onKeyPress={(e) => { if (e.key === 'Enter') applyTextFilters(); }} // Buscar al presionar Enter
                         />
                    </Grid>
                     <Grid item xs={12} sm={6} md={4}>
                         <TextField
                            size="small" fullWidth label="Filtrar por Barrio"
                            value={filterBarrio}
                            onChange={handleTextFilterChange(setFilterBarrio)}
                            // onKeyPress={(e) => { if (e.key === 'Enter') applyTextFilters(); }}
                         />
                    </Grid>
                     {/* Botones para aplicar/limpiar filtros de texto/ubicación */}
                     <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 1}}>
                        <Button onClick={applyTextFilters} startIcon={<FilterListIcon/>} size="small" variant='outlined'>Buscar Zona/Barrio</Button>
                        <Button onClick={clearLocationFilters} startIcon={<FilterListOffIcon/>} size="small" color="secondary">Limpiar Ubic.</Button>
                     </Grid>
                </Grid>
            </Paper>
               
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ height: 700, width: '100%' }} variant="outlined">
                <DataGrid
                    rows={members}
                    columns={columns}
                    getRowId={(row) => row.registrationCode || row._id} // Usar código de registro o _id como ID
                    loading={loading}
                    // --- Paginación Server-Side ---
                    paginationMode="server"
                    rowCount={totalRowCount}
                    pageSizeOptions={[10, 25, 50]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={handlePaginationModelChange}
                    // --- Fin Paginación ---
                    slots={{ toolbar: GridToolbar }}
                    slotProps={{ toolbar: { showQuickFilter: true } }}
                    density="compact"
                    disableRowSelectionOnClick
                />
            </Paper>
        </Box>
    );
};

export default MemberManagement;