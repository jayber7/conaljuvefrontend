// src/components/Admin/TribunalFormModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid,
    CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel, FormHelperText,
    Typography, Box, IconButton, Divider
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale/es';
import api from '../../services/api';

// --- Constantes ---
const tribunalLevels = ['DEPARTAMENTAL', 'MUNICIPAL', 'VECINAL'];
// Necesitarás cargar las listas de Departamentos y Municipios para el Select de locationCode
// Deberías pasar estas listas como props o usar un hook/contexto

const TribunalFormModal = ({ open, onClose, onSaveSuccess, initialData, departments = [], municipalities = [] /* Recibir listas */ }) => {
    const isEditing = !!initialData;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            level: '',
            locationCode: '', // Será número o string
            locationName: '', // Nombre para referencia
            directory: [{ role: '', fullName: '' }], // Empezar con un miembro
            statuteUrl: '',
            regulationsUrl: '',
            termStartDate: null,
            termEndDate: null,
            isActive: true,
        }
    });

    // Hook para manejar el array de directorio
    const { fields: directoryFields, append: appendDirectoryMember, remove: removeDirectoryMember } = useFieldArray({
        control,
        name: "directory"
    });

    const selectedLevel = watch('level');

    // --- useEffect para resetear/poblar el formulario ---
    useEffect(() => {
        if (open) {
            setError('');
            if (isEditing && initialData) {
                reset({
                    level: initialData.level || '',
                    locationCode: initialData.locationCode || '',
                    locationName: initialData.locationName || '',
                    directory: initialData.directory?.length ? initialData.directory : [{ role: '', fullName: '' }],
                    statuteUrl: initialData.statuteUrl || '',
                    regulationsUrl: initialData.regulationsUrl || '',
                    termStartDate: initialData.termStartDate ? new Date(initialData.termStartDate) : null,
                    termEndDate: initialData.termEndDate ? new Date(initialData.termEndDate) : null,
                    isActive: initialData.isActive !== undefined ? initialData.isActive : true,
                });
            } else {
                // Reset a valores por defecto para nuevo tribunal
                reset({
                    level: '', locationCode: '', locationName: '', directory: [{ role: '', fullName: '' }],
                    statuteUrl: '', regulationsUrl: '', termStartDate: null, termEndDate: null, isActive: true,
                });
            }
        }
    }, [open, isEditing, initialData, reset]);

    // --- onSubmit ---
    const onSubmit = async (data) => {
        setLoading(true); setError('');

        // Formatear datos antes de enviar
        const tribunalData = {
            ...data,
            // Asegurar que directorio no envíe miembros vacíos
            directory: data.directory?.filter(m => m.role && m.fullName),
            // Asegurar formato de fechas si existen
            termStartDate: data.termStartDate || undefined,
            termEndDate: data.termEndDate || undefined,
            // Convertir locationCode a número si es DEPARTAMENTAL o MUNICIPAL
            locationCode: (data.level === 'DEPARTAMENTAL' || data.level === 'MUNICIPAL')
                            ? Number(data.locationCode)
                            : data.locationCode // Mantener como string para VECINAL
        };
         // Limpiar undefined/null si es necesario (backend debería manejarlo)
         // Object.keys(tribunalData).forEach(key => (tribunalData[key] === undefined || tribunalData[key] === null) && delete tribunalData[key]);

        try {
            if (isEditing) {
                await api.put(`/tribunals/${initialData._id}`, tribunalData);
            } else {
                await api.post('/tribunals', tribunalData);
            }
            onSaveSuccess(); // Llama a la función del padre para recargar/cerrar
        } catch (err) { setError(err.response?.data?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el tribunal.`); console.error(err); }
        finally { setLoading(false); }
    };


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
            <DialogTitle>{isEditing ? 'Editar Tribunal' : 'Registrar Nuevo Tribunal'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>

                        {/* --- Datos Generales --- */}
                        <Grid item xs={12} sm={4}>
                            <FormControl required fullWidth size="small" error={!!errors.level}>
                                <InputLabel id="level-label">Nivel*</InputLabel>
                                <Controller name="level" control={control} rules={{ required: 'Nivel requerido' }}
                                    render={({ field }) => (
                                        <Select labelId="level-label" label="Nivel*" {...field}>
                                            <MenuItem value=""><em>Seleccione...</em></MenuItem>
                                            {tribunalLevels.map(lvl => <MenuItem key={lvl} value={lvl}>{lvl.charAt(0) + lvl.slice(1).toLowerCase()}</MenuItem>)}
                                        </Select>
                                    )} />
                                {errors.level && <FormHelperText error>{errors.level.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            {/* Location Code: Select si es Dept/Muni, Text si es Vecinal */}
                            {selectedLevel === 'DEPARTAMENTAL' || selectedLevel === 'MUNICIPAL' ? (
                                <FormControl required fullWidth size="small" error={!!errors.locationCode}>
                                     <InputLabel id="loc-code-label">Ubicación (Depto/Muni)*</InputLabel>
                                     <Controller name="locationCode" control={control} rules={{ required: 'Ubicación requerida' }}
                                        render={({ field }) => (
                                            <Select labelId="loc-code-label" label="Ubicación (Depto/Muni)*" {...field}>
                                                <MenuItem value=""><em>Seleccione...</em></MenuItem>
                                                 {(selectedLevel === 'DEPARTAMENTAL' ? departments : municipalities).map(loc => (
                                                     <MenuItem key={loc.code} value={loc.code}>{loc.name}</MenuItem>
                                                 ))}
                                            </Select>
                                        )} />
                                     {errors.locationCode && <FormHelperText error>{errors.locationCode.message}</FormHelperText>}
                                </FormControl>
                            ) : (
                                <TextField fullWidth label="Ubicación (Cod/Nombre)*" size="small" {...register("locationCode", { required: 'Ubicación requerida' })} error={!!errors.locationCode} helperText={errors.locationCode?.message} disabled={loading || !selectedLevel}/>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Nombre Ref. Ubicación*" size="small" {...register("locationName", { required: 'Nombre requerido' })} error={!!errors.locationName} helperText={errors.locationName?.message} disabled={loading}/>
                        </Grid>

                        {/* --- Fechas de Gestión --- */}
                         <Grid item xs={12} sm={6}><Controller name="termStartDate" control={control} render={({ field }) => (<DatePicker slotProps={{ textField: { fullWidth: true, size: 'small', error: !!errors.termStartDate, helperText: errors.termStartDate?.message } }} label="Inicio Gestión" {...field} value={field.value || null} disabled={loading} /> )}/></Grid>
                         <Grid item xs={12} sm={6}><Controller name="termEndDate" control={control} render={({ field }) => (<DatePicker slotProps={{ textField: { fullWidth: true, size: 'small', error: !!errors.termEndDate, helperText: errors.termEndDate?.message } }} label="Fin Gestión" {...field} value={field.value || null} disabled={loading} minDate={watch('termStartDate') || undefined} /> )}/></Grid>

                         {/* --- URLs Documentos --- */}
                         <Grid item xs={12} sm={6}><TextField fullWidth label="URL Estatuto/Reglamento" size="small" type="url" {...register("statuteUrl", { pattern: /^(https?:\/\/).*/i })} error={!!errors.statuteUrl} helperText={errors.statuteUrl?.message || 'URL inválida'} disabled={loading}/></Grid>
                         <Grid item xs={12} sm={6}><TextField fullWidth label="URL Régimen/Normativa" size="small" type="url" {...register("regulationsUrl", { pattern: /^(https?:\/\/).*/i })} error={!!errors.regulationsUrl} helperText={errors.regulationsUrl?.message || 'URL inválida'} disabled={loading}/></Grid>

                        {/* --- Directorio (Dinámico) --- */}
                         <Grid item xs={12}>
                             <Divider sx={{ my: 2 }}><Typography variant="overline">Directorio</Typography></Divider>
                             {directoryFields.map((field, index) => (
                                <Grid container spacing={1} key={field.id} sx={{ mb: 1.5, alignItems: 'center' }}>
                                     <Grid item xs={5}>
                                        <TextField fullWidth size="small" label={`Cargo ${index + 1}`} {...register(`directory.${index}.role`, { required: true })} error={!!errors.directory?.[index]?.role} helperText={errors.directory?.[index]?.role ? 'Requerido' : ''} disabled={loading} />
                                    </Grid>
                                     <Grid item xs={6}>
                                        <TextField fullWidth size="small" label={`Nombre Completo ${index + 1}`} {...register(`directory.${index}.fullName`, { required: true })} error={!!errors.directory?.[index]?.fullName} helperText={errors.directory?.[index]?.fullName ? 'Requerido' : ''} disabled={loading}/>
                                    </Grid>
                                     <Grid item xs={1}>
                                         <IconButton onClick={() => removeDirectoryMember(index)} disabled={loading || directoryFields.length <= 1} size="small" color="error">
                                             <DeleteIcon />
                                         </IconButton>
                                    </Grid>
                                </Grid>
                             ))}
                              <Button
                                  size="small"
                                  onClick={() => appendDirectoryMember({ role: '', fullName: '' })}
                                  startIcon={<AddCircleIcon />}
                                  disabled={loading}
                              >
                                  Añadir Miembro al Directorio
                              </Button>
                         </Grid>

                          {/* --- Estado Activo (Solo Editar) --- */}
                         {isEditing && (
                             <Grid item xs={12}>
                                 <Controller name="isActive" control={control} render={({ field }) => (<FormControlLabel control={<Switch {...field} checked={field.value} />} label="Tribunal Activo" disabled={loading}/> )}/>
                             </Grid>
                         )}
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px', borderTop: 1, borderColor: 'divider' }}>
                    <Button onClick={onClose} disabled={loading} color="inherit">Cancelar</Button>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit"/> : (isEditing ? 'Guardar Cambios' : 'Crear Tribunal')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
        </LocalizationProvider>
    );
};

export default TribunalFormModal;