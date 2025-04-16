// src/components/Admin/UserManagement.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Select, MenuItem, FormControl, Tooltip, IconButton, Paper } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../../services/api';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../../contexts/AuthContext'; // Para obtener ID del admin actual

const UserManagement = () => {
  
  const { user: adminUser } = useAuth(); // Obtener datos del admin logueado
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingRole, setSavingRole] = useState({}); // { userId: true } si se está guardando el rol para ese user
  const [roleUpdateError, setRoleUpdateError] = useState({}); // { userId: 'mensaje error'}
  const [roleUpdateSuccess, setRoleUpdateSuccess] = useState({}); // { userId: true }

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/users?limit=50'); // Ajusta límite o implementa paginación server-side
      setUsers(response.data.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar usuarios.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    if (!userId || !newRole) return;

    // Evitar que el admin se cambie el rol a sí mismo desde aquí (más seguro)
    if (adminUser._id === userId) {
        setRoleUpdateError(prev => ({ ...prev, [userId]: 'No puedes cambiar tu propio rol aquí.' }));
        setTimeout(() => setRoleUpdateError(prev => ({ ...prev, [userId]: ''})), 3000);
        return;
    }


    setSavingRole(prev => ({ ...prev, [userId]: true }));
    setRoleUpdateError(prev => ({ ...prev, [userId]: '' }));
    setRoleUpdateSuccess(prev => ({ ...prev, [userId]: false }));


    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      // Actualizar la lista localmente para reflejar el cambio inmediatamente
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
       setRoleUpdateSuccess(prev => ({ ...prev, [userId]: true }));
       setTimeout(() => setRoleUpdateSuccess(prev => ({ ...prev, [userId]: false})), 2000); // Mensaje de éxito temporal


    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error al actualizar el rol.';
      setRoleUpdateError(prev => ({ ...prev, [userId]: errorMsg }));
       setTimeout(() => setRoleUpdateError(prev => ({ ...prev, [userId]: ''})), 5000); // Ocultar error después de 5s
      console.error("Error updating role:", err);
    } finally {
      setSavingRole(prev => ({ ...prev, [userId]: false }));
    }
  };

  const columns = [
    { field: 'name', headerName: 'Nombre', flex: 1, minWidth: 180 },
    { field: 'username', headerName: 'Usuario', width: 150 },
    { field: 'email', headerName: 'Correo', flex: 1, minWidth: 200 },
    {
        field: 'role',
        headerName: 'Rol',
        width: 180,
        renderCell: (params) => {
            const userId = params.id;
            const currentRole = params.value;
            const isSaving = savingRole[userId];
            const errorMsg = roleUpdateError[userId];
            const success = roleUpdateSuccess[userId];
            const isCurrentUser = adminUser._id === userId; // Es el admin logueado?


            return (
               <Box sx={{ width: '100%', display: 'flex', alignItems: 'center'}}>
                 <FormControl variant="standard" size="small" fullWidth error={!!errorMsg}>
                    {/* <InputLabel id={`role-select-label-${userId}`}>Rol</InputLabel> */}
                    <Select
                        // labelId={`role-select-label-${userId}`}
                        value={currentRole}
                        onChange={(e) => handleRoleChange(userId, e.target.value)}
                        disabled={isSaving || isCurrentUser} // Deshabilitar si está guardando o es el usuario actual
                        // sx={{ fontWeight: currentRole === 'ADMIN' ? 'bold' : 'normal' }}
                        sx={{ fontWeight: ['ADMIN', 'STAFF'].includes(currentRole) ? 'bold' : 'normal' }} // Negrita para Admin/Staff
                        IconComponent={isSaving ? () => <CircularProgress size={20} sx={{ mr: 1}}/> : undefined } // Indicador de carga
                    >
                        <MenuItem value="USER"><PersonIcon /*...*/ /> Usuario</MenuItem>
                        <MenuItem value="STAFF"><BadgeIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'bottom' }}/> Staff</MenuItem> {/* Usa un icono apropiado */}
                        <MenuItem value="ADMIN"><AdminPanelSettingsIcon /*...*/ /> Administrador</MenuItem>
                        
                    </Select>
                    {/* Mostrar icono de éxito o error temporalmente */}
                     {success && <CheckCircleIcon color="success" sx={{ ml: 1 }} fontSize="small"/>}
                     {errorMsg && <Tooltip title={errorMsg}><CancelIcon color="error" sx={{ ml: 1 }} fontSize="small"/></Tooltip>}
                 </FormControl>

               </Box>
            );
        }
    },
    {
        field: 'createdAt',
        headerName: 'Registrado',
        width: 130,
        type: 'string',
        valueGetter: (value,row) => {return `${row.createdAt || ''}`;},
        
    },
    {
        field: 'location', // <-- Campo directo si el backend lo envía
        headerName: 'Departamento',
        width: 150,
        type: 'string',
        // valueGetter opcional si quieres manejar casos null/undefined o mostrar código como fallback
        valueGetter: (value, row) => {return `${row.location.departmentName  || ''}`;},
        //valueGetter: (row) => row.location?.departmentName || row.location?.departmentCode || 'N/A',
    },

     { field: 'isActive', headerName: 'Activo', width: 90, type: 'boolean'},

  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Gestión de Usuarios
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] }
          }}
          pageSizeOptions={[10, 25, 50]}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: { showQuickFilter: true },
          }}
          density="compact"
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
};

export default UserManagement;