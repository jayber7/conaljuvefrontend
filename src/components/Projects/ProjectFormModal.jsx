// src/components/Projects/ProjectFormModal.jsx
import React, { useState, useEffect, useCallback  } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid,
    CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel, FormHelperText, Typography
} from '@mui/material';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { es } from 'date-fns/locale/es';
import api from '../../services/api';

// Asumiendo que tienes estados/lógica similar para cargar Dept/Prov/Mun
// Deberías mover esa lógica a un Hook personalizado (ej. useLocationData) para reutilizarla

const ProjectFormModal = ({ open, onClose, onSaveSuccess, initialData }) => {
    const isEditing = !!initialData;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // Estados para selects de ubicación
    const [departments, setDepartments] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [loadingLocation, setLoadingLocation] = useState({ dep: false, prov: false, mun: false });

    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            projectName: '',
            objective: '',
            location: { departmentCode: '', provinceCode: '', municipalityCode: '', zone: '', barrio: '', calle: '' },
            fundingSource: '',
            beneficiaries: '',
            startDate: null, // Usar null para DatePicker
            endDate: null,
            status: 'PLANIFICADO', // Default status
        }
    });

    const selectedDepartmentCode = watch('location.departmentCode');
    const selectedProvinceCode = watch('location.provinceCode');

    // --- useEffect para cargar datos iniciales y ubicaciones ---
     useEffect(() => {
         const loadData = async () => {
             // Cargar Departamentos
             setLoadingLocation(prev => ({ ...prev, dep: true }));
             try {
                  const resDeps = await api.get('/locations/departments');
                  setDepartments(resDeps.data.data.departments || []);
                  // Si estamos editando, cargar provincias/municipios iniciales
                  if (isEditing && initialData?.location?.departmentCode) {
                      await loadProvinces(initialData.location.departmentCode);
                      if (initialData.location.provinceCode) {
                           await loadMunicipalities(initialData.location.provinceCode);
                      }
                  }
             } catch (err) { console.error(err); }
             finally { setLoadingLocation(prev => ({ ...prev, dep: false })); }
         };

         if (open) {
             setError('');
             if (isEditing && initialData) {
                 reset({
                     projectName: initialData.projectName || '',
                     objective: initialData.objective || '',
                     location: {
                         departmentCode: initialData.location?.departmentCode || '',
                         provinceCode: initialData.location?.provinceCode || '',
                         municipalityCode: initialData.location?.municipalityCode || '',
                         zone: initialData.location?.zone || '',
                         barrio: initialData.location?.barrio || '',
                         calle: initialData.location?.calle || ''
                     },
                     fundingSource: initialData.fundingSource || '',
                     beneficiaries: initialData.beneficiaries || '',
                     startDate: initialData.startDate ? new Date(initialData.startDate) : null,
                     endDate: initialData.endDate ? new Date(initialData.endDate) : null,
                     status: initialData.status || 'PLANIFICADO',
                 });
             } else {
                 reset({ // Valores por defecto para nuevo proyecto
                    projectName: '', objective: '',
                    location: { departmentCode: '', provinceCode: '', municipalityCode: '', zone: '', barrio: '', calle: '' },
                    fundingSource: '', beneficiaries: '', startDate: null, endDate: null, status: 'PLANIFICADO',
                 });
                 setProvinces([]); setMunicipalities([]); // Limpiar listas
             }
             loadData(); // Cargar departamentos (y dependientes si es edición)
         }
     }, [open, isEditing, initialData, reset]); // Faltaba 'reset' en dependencias

      // --- Funciones para cargar Provincias/Municipios (similar a otros forms) ---
     const loadProvinces = useCallback(async (deptCode) => {
        if (!deptCode) { setProvinces([]); return; }
        setLoadingLocation(prev => ({ ...prev, prov: true }));
        try {
             const res = await api.get(`/locations/provinces?departmentCode=${deptCode}`);
             setProvinces(res.data.data.provinces || []);
        } catch (err) { console.error(err); setProvinces([]); }
        finally { setLoadingLocation(prev => ({ ...prev, prov: false })); }
     }, []);

     const loadMunicipalities = useCallback(async (provCode) => {
         if (!provCode) { setMunicipalities([]); return; }
          setLoadingLocation(prev => ({ ...prev, mun: true }));
         try {
             const res = await api.get(`/locations/municipalities?provinceCode=${provCode}`);
             setMunicipalities(res.data.data.municipalities || []);
         } catch (err) { console.error(err); setMunicipalities([]); }
         finally { setLoadingLocation(prev => ({ ...prev, mun: false })); }
     }, []);

    useEffect(() => {
        if (selectedDepartmentCode) {
            setValue('location.provinceCode', ''); // Resetear provincia
            setValue('location.municipalityCode', ''); // Resetear municipio
            loadProvinces(selectedDepartmentCode);
        } else {
             setProvinces([]);
             setMunicipalities([]);
        }
    }, [selectedDepartmentCode, loadProvinces, setValue]);

    useEffect(() => {
        if (selectedProvinceCode) {
            setValue('location.municipalityCode', ''); // Resetear municipio
            loadMunicipalities(selectedProvinceCode);
        } else {
            setMunicipalities([]);
        }
    }, [selectedProvinceCode, loadMunicipalities, setValue]);
     // --- Fin Carga Ubicaciones ---


    // --- onSubmit ---
    const onSubmit = async (data) => {
        setLoading(true); setError('');

         // Validar fechas
         if (data.startDate && data.endDate && data.endDate < data.startDate) {
            setError('La fecha de finalización no puede ser anterior a la de inicio.');
            setLoading(false);
            return;
         }

        const projectData = {
             projectName: data.projectName,
             objective: data.objective,
             location: {
                 departmentCode: Number(data.location.departmentCode),
                 provinceCode: Number(data.location.provinceCode),
                 municipalityCode: Number(data.location.municipalityCode),
                 zone: data.location.zone,
                 barrio: data.location.barrio,
                 calle: data.location.calle || undefined,
             },
             fundingSource: data.fundingSource,
             beneficiaries: data.beneficiaries,
             startDate: data.startDate, // Ya es objeto Date
             endDate: data.endDate,     // Ya es objeto Date
             status: data.status,
         };
         Object.keys(projectData.location).forEach(key => projectData.location[key] === undefined && delete projectData.location[key]);

        try {
            if (isEditing) {
                await api.put(`/projects/${initialData._id}`, projectData);
            } else {
                await api.post('/projects', projectData);
            }
            onSaveSuccess(); // Llama a la función del padre para recargar/cerrar
        } catch (err) { setError(err.response?.data?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el proyecto.`); console.error(err); }
        finally { setLoading(false); }
    };


    return (

        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
            <DialogTitle>{isEditing ? 'Editar Proyecto Vecinal' : 'Registrar Nuevo Proyecto Vecinal'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        {/* --- Datos del Proyecto --- */}
                        <Grid item xs={12}> <TextField fullWidth label="Nombre del Proyecto*" size="small" {...register("projectName", { required: true })} error={!!errors.projectName} helperText={errors.projectName?.message} disabled={loading}/> </Grid>
                        <Grid item xs={12}> <TextField fullWidth label="Objetivo*" multiline rows={3} size="small" {...register("objective", { required: true })} error={!!errors.objective} helperText={errors.objective?.message} disabled={loading}/> </Grid>
                        <Grid item xs={12} md={6}> <TextField fullWidth label="Fuente de Financiamiento*" size="small" {...register("fundingSource", { required: true })} error={!!errors.fundingSource} helperText={errors.fundingSource?.message} disabled={loading}/> </Grid>
                        <Grid item xs={12} md={6}> <TextField fullWidth label="Beneficiarios*" size="small" {...register("beneficiaries", { required: true })} error={!!errors.beneficiaries} helperText={errors.beneficiaries?.message} disabled={loading}/> </Grid>

                        {/* --- Fechas --- */}
                         <Grid item xs={12} sm={6}><Controller name="startDate" control={control} rules={{ required: 'Fecha inicio requerida' }} render={({ field }) => (<DatePicker slotProps={{ textField: { fullWidth: true, size: 'small', error: !!errors.startDate, helperText: errors.startDate?.message } }} label="Fecha Inicio*" {...field} value={field.value || null} disabled={loading} /> )}/></Grid>
                         <Grid item xs={12} sm={6}><Controller name="endDate" control={control} rules={{ required: 'Fecha fin requerida' }} render={({ field }) => (<DatePicker slotProps={{ textField: { fullWidth: true, size: 'small', error: !!errors.endDate, helperText: errors.endDate?.message } }} label="Fecha Fin*" {...field} value={field.value || null} disabled={loading} minDate={watch('startDate') || undefined} /> )}/></Grid> {/* minDate opcional */}

                          {/* --- Ubicación --- */}
                         <Grid item xs={12}> <Typography variant="subtitle1" sx={{mt: 1, fontWeight: 'bold'}}>Ubicación del Proyecto*</Typography></Grid>
                          <Grid item xs={12} sm={6}  style={{ width: '15%' }}><FormControl required fullWidth size="small" error={!!errors.location?.departmentCode} disabled={loadingLocation.dep || loading}><InputLabel shrink={true}>Departamento*</InputLabel><Controller name="location.departmentCode" rules={{ required: true}} control={control} render={({ field }) => ( <Select label="Departamento*" {...field} ><MenuItem value=""><em>Seleccione...</em></MenuItem>{departments.map(d => <MenuItem key={d.code} value={d.code}>{d.name}</MenuItem>)}</Select> )}/></FormControl> </Grid>
                          <Grid item xs={12} sm={6}  style={{ width: '15%' }}><FormControl required fullWidth size="small" error={!!errors.location?.provinceCode} disabled={!selectedDepartmentCode || loadingLocation.prov || loading}><InputLabel shrink={true}>Provincia*</InputLabel><Controller name="location.provinceCode" rules={{ required: true}} control={control} render={({ field }) => ( <Select label="Provincia*" {...field} ><MenuItem value=""><em>Seleccione...</em></MenuItem>{provinces.map(p => <MenuItem key={p.code} value={p.code}>{p.name}</MenuItem>)}</Select> )}/></FormControl> </Grid>
                          <Grid item xs={12} sm={6}  style={{ width: '15%' }}><FormControl required fullWidth size="small" error={!!errors.location?.municipalityCode} disabled={!selectedProvinceCode || loadingLocation.mun || loading}><InputLabel shrink={true}>Municipio*</InputLabel><Controller name="location.municipalityCode" rules={{ required: true}} control={control} render={({ field }) => ( <Select label="Municipio*" {...field} ><MenuItem value=""><em>Seleccione...</em></MenuItem>{municipalities.map(m => <MenuItem key={m.code} value={m.code}>{m.name}</MenuItem>)}</Select> )}/></FormControl> </Grid>
                          <Grid item xs={12} sm={6} ><TextField required fullWidth label="Zona*" size="small" {...register("location.zone", { required: true })} error={!!errors.location?.zone} helperText={errors.location?.zone?.message} disabled={loading} slotProps={{ inputLabel: { shrink: true } }}/></Grid>
                            <Grid item xs={12} sm={6}><TextField required fullWidth label="Barrio*" size="small" {...register("location.barrio", { required: true })} error={!!errors.location?.barrio} helperText={errors.location?.barrio?.message} disabled={loading} InputLabelProps={{ shrink: true }}/></Grid>
                          <Grid item xs={12} sm={6}><TextField fullWidth label="Calle/Av. (Opcional)" size="small" {...register("location.calle")} disabled={loading} InputLabelProps={{ shrink: true }}/></Grid>

                         {/* --- Estado (Opcional, si es editable) --- */}
                         {isEditing && (
                             <Grid item xs={12} sm={6}>
                                <FormControl fullWidth size="small" disabled={loading}>
                                    <InputLabel>Estado</InputLabel>
                                    <Controller name="status" control={control} render={({ field }) => (
                                        <Select label="Estado" {...field}>
                                            <MenuItem value="PLANIFICADO">Planificado</MenuItem>
                                            <MenuItem value="EN_EJECUCION">En Ejecución</MenuItem>
                                            <MenuItem value="COMPLETADO">Completado</MenuItem>
                                            <MenuItem value="CANCELADO">Cancelado</MenuItem>
                                            <MenuItem value="SUSPENDIDO">Suspendido</MenuItem>
                                        </Select>
                                     )}/>
                                </FormControl>
                            </Grid>
                         )}

                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px', borderTop: 1, borderColor: 'divider' }}>
                    <Button onClick={onClose} disabled={loading} color="inherit">Cancelar</Button>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit"/> : (isEditing ? 'Guardar Cambios' : 'Registrar Proyecto')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>

    );
};

export default ProjectFormModal;