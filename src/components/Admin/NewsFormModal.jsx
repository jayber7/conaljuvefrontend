// src/components/Admin/NewsFormModal.jsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, CircularProgress, Alert, Switch, FormControlLabel, Box, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material'; // Añadir Typography si no estaba
import api from '../../services/api';
// Opcional: ReactQuill para editor

const NewsFormModal = ({ open, onClose, onSaveSuccess, initialData }) => {
    const isEditing = !!initialData;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [departments, setDepartments] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [loadingLocation, setLoadingLocation] = useState({ dep: false, prov: false, mun: false });

    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
        defaultValues: { // Usar códigos numéricos o '' como default
            title: '', summary: '', content: '', imageUrl: '',
            publicationDate: new Date().toISOString().split('T')[0],
            tags: [],
            locationScope: { departmentCode: '', provinceCode: '', municipalityCode: '', zone: '' },
            isPublished: true,
        }
    });

    // Observar códigos para cargar dependientes
    const selectedDepartmentCode = watch('locationScope.departmentCode');
    const selectedProvinceCode = watch('locationScope.provinceCode');

    // --- Cargar datos iniciales y ubicaciones ---
    useEffect(() => {
        const fetchInitialData = async () => {
            // Cargar Departamentos
            setLoadingLocation(prev => ({ ...prev, dep: true }));
            try {
                const resDeps = await api.get('/locations/departments');
                setDepartments(resDeps.data.data.departments || []);
            } catch (err) { console.error("Error fetching departments:", err); }
            finally { setLoadingLocation(prev => ({ ...prev, dep: false })); }

            // Si es edición, poblar formulario
            if (isEditing && initialData) {
                reset({
                    title: initialData.title || '',
                    summary: initialData.summary || '',
                    content: initialData.content || '',
                    imageUrl: initialData.imageUrl || '',
                    publicationDate: initialData.publicationDate ? new Date(initialData.publicationDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    tags: initialData.tags || [],
                    // --- MODIFICACIÓN: Usar códigos numéricos ---
                    locationScope: {
                        departmentCode: initialData.locationScope?.departmentCode || '',
                        provinceCode: initialData.locationScope?.provinceCode || '',
                        municipalityCode: initialData.locationScope?.municipalityCode || '',
                        zone: initialData.locationScope?.zone || ''
                    },
                    // --- FIN MODIFICACIÓN ---
                    isPublished: initialData.isPublished !== undefined ? initialData.isPublished : true,
                });
                // Nota: Los useEffect siguientes cargarán Prov y Mun si hay códigos iniciales
            } else {
                // Reset a valores por defecto si es nuevo
                reset({
                    title: '', summary: '', content: '', imageUrl: '',
                    publicationDate: new Date().toISOString().split('T')[0],
                    tags: [],
                    locationScope: { departmentCode: '', provinceCode: '', municipalityCode: '', zone: '' },
                    isPublished: true,
                });
                // Limpiar listas desplegables
                setProvinces([]);
                setMunicipalities([]);
            }
        };

        if (open) {
            setError('');
            fetchInitialData();
        }
    }, [open, isEditing, initialData, reset]);

    // --- Cargar Provincias al cambiar Departamento ---
    useEffect(() => {
        // Solo ejecutar si hay un código de depto y el modal está abierto
        if (selectedDepartmentCode && open) {
            const fetchProvs = async () => {
                setLoadingLocation(prev => ({ ...prev, prov: true }));
                setProvinces([]); // Limpiar antes de cargar
                setMunicipalities([]); // También limpiar municipios
                setValue('locationScope.provinceCode', ''); // Resetear valor del select
                setValue('locationScope.municipalityCode', '');
                try {
                    const res = await api.get(`/locations/provinces?departmentCode=${selectedDepartmentCode}`);
                    setProvinces(res.data.data.provinces || []);
                } catch (err) { console.error("Error fetching provinces:", err); }
                finally { setLoadingLocation(prev => ({ ...prev, prov: false })); }
            };
            fetchProvs();
        } else if (open) { // Si se deselecciona el depto y el modal está abierto
            setProvinces([]);
            setMunicipalities([]);
            setValue('locationScope.provinceCode', '');
            setValue('locationScope.municipalityCode', '');
        }
    }, [selectedDepartmentCode, open, setValue]); // Depender del código y 'open'

    // --- Cargar Municipios al cambiar Provincia ---
    useEffect(() => {
        if (selectedProvinceCode && open) {
            const fetchMuns = async () => {
                setLoadingLocation(prev => ({ ...prev, mun: true }));
                setMunicipalities([]); // Limpiar antes de cargar
                setValue('locationScope.municipalityCode', ''); // Resetear valor del select
                try {
                    const res = await api.get(`/locations/municipalities?provinceCode=${selectedProvinceCode}`);
                    setMunicipalities(res.data.data.municipalities || []);
                } catch (err) { console.error("Error fetching municipalities:", err); }
                finally { setLoadingLocation(prev => ({ ...prev, mun: false })); }
            };
            fetchMuns();
        } else if (open) {
            setMunicipalities([]);
            setValue('locationScope.municipalityCode', '');
        }
    }, [selectedProvinceCode, open, setValue]); // Depender del código y 'open'
    // --- Fin Carga Ubicaciones ---


    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        // --- MODIFICACIÓN: Asegurar que los códigos sean números o null/undefined ---
        const formattedData = {
            ...data,
            tags: typeof data.tags === 'string' ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : (data.tags || []),
            locationScope: {
                departmentCode: data.locationScope.departmentCode ? Number(data.locationScope.departmentCode) : undefined,
                provinceCode: data.locationScope.provinceCode ? Number(data.locationScope.provinceCode) : undefined,
                municipalityCode: data.locationScope.municipalityCode ? Number(data.locationScope.municipalityCode) : undefined,
                zone: data.locationScope.zone || undefined,
            }
        };
        // Eliminar claves de locationScope si son undefined
         Object.keys(formattedData.locationScope).forEach(key => formattedData.locationScope[key] === undefined && delete formattedData.locationScope[key]);
         // --- FIN MODIFICACIÓN ---


        try {
            if (isEditing) {
                await api.put(`/news/${initialData._id}`, formattedData);
            } else {
                await api.post('/news', formattedData);
            }
            onSaveSuccess();
        } catch (err) {
            setError(err.response?.data?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la noticia.`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
            <DialogTitle>{isEditing ? 'Editar Noticia' : 'Crear Nueva Noticia'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        {/* Campos title, summary, content, imageUrl, publicationDate, tags (sin cambios) */}
                        <Grid item xs={12}> <TextField fullWidth label="Título*" {...register("title", { required: "Título requerido" })} error={!!errors.title} helperText={errors.title?.message} disabled={loading} /> </Grid>
                        <Grid item xs={12}> <TextField fullWidth label="Resumen*" multiline rows={3} {...register("summary", { required: "Resumen requerido" })} error={!!errors.summary} helperText={errors.summary?.message} disabled={loading} /> </Grid>
                        <Grid item xs={12}> <TextField fullWidth label="Contenido*" multiline rows={8} {...register("content", { required: "Contenido requerido" })} error={!!errors.content} helperText={errors.content?.message} disabled={loading} /> </Grid>
                         <Grid item xs={12} md={6}> <TextField fullWidth label="URL de Imagen" type="url" {...register("imageUrl", { pattern: { value: /^(https?:\/\/).*/i, message: "URL inválida"} })} error={!!errors.imageUrl} helperText={errors.imageUrl?.message} disabled={loading} /> </Grid>
                         <Grid item xs={12} md={6}> <TextField fullWidth label="Fecha de Publicación*" type="date" InputLabelProps={{ shrink: true }} {...register("publicationDate", { required: "Fecha requerida"})} error={!!errors.publicationDate} helperText={errors.publicationDate?.message} disabled={loading} /> </Grid>
                         <Grid item xs={12}> <TextField fullWidth label="Etiquetas (separadas por coma)" {...register("tags")} error={!!errors.tags} helperText={errors.tags?.message || "Ej: Seguridad, El Alto, Elecciones"} disabled={loading} /> </Grid>


                        {/* --- Ubicación (Usando Códigos) --- */}
                        <Grid item xs={12}> <Typography variant="subtitle2" sx={{mt: 1}}>Ámbito de la Noticia (Opcional)</Typography></Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth error={!!errors.locationScope?.departmentCode} disabled={loadingLocation.dep || loading}>
                                <InputLabel id="dept-code-label">Departamento</InputLabel>
                                <Controller
                                    name="locationScope.departmentCode" // <-- Nombre de campo modificado
                                    control={control}
                                    render={({ field }) => (
                                        <Select labelId="dept-code-label" label="Departamento" {...field} >
                                            <MenuItem value=""><em>(Opcional)</em></MenuItem>
                                            {/* Usar code como value */}
                                            {departments.map(d => <MenuItem key={d.code} value={d.code}>{d.name}</MenuItem>)}
                                        </Select>
                                    )}
                                />
                                {errors.locationScope?.departmentCode && <Typography color="error" variant="caption">{errors.locationScope.departmentCode.message}</Typography>}
                            </FormControl>
                        </Grid>
                         <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth error={!!errors.locationScope?.provinceCode} disabled={!selectedDepartmentCode || loadingLocation.prov || loading}>
                                <InputLabel id="prov-code-label">Provincia</InputLabel>
                                 <Controller
                                    name="locationScope.provinceCode" // <-- Nombre de campo modificado
                                    control={control}
                                    render={({ field }) => (
                                        <Select labelId="prov-code-label" label="Provincia" {...field} >
                                            {/* <MenuItem value=""><em>{loadingLocation.prov ? 'Cargando...' : '(Opcional)'}</em></MenuItem> */}
                                            <MenuItem value=""><em>(Opcional)</em></MenuItem>
                                            {/* Usar code como value */}
                                            {provinces.map(p => <MenuItem key={p.code} value={p.code}>{p.name}</MenuItem>)}
                                        </Select>
                                    )}
                                />
                                {errors.locationScope?.provinceCode && <Typography color="error" variant="caption">{errors.locationScope.provinceCode.message}</Typography>}
                           </FormControl>
                        </Grid>
                         <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth error={!!errors.locationScope?.municipalityCode} disabled={!selectedProvinceCode || loadingLocation.mun || loading}>
                                <InputLabel id="muni-code-label">Municipio</InputLabel>
                                 <Controller
                                    name="locationScope.municipalityCode" // <-- Nombre de campo modificado
                                    control={control}
                                    render={({ field }) => (
                                        <Select labelId="muni-code-label" label="Municipio" {...field} >
                                             <MenuItem value=""><em>{loadingLocation.mun ? 'Cargando...' : '(Opcional)'}</em></MenuItem>
                                             {/* Usar code como value */}
                                            {municipalities.map(m => <MenuItem key={m.code} value={m.code}>{m.name}</MenuItem>)}
                                        </Select>
                                    )}
                                />
                                {errors.locationScope?.municipalityCode && <Typography color="error" variant="caption">{errors.locationScope.municipalityCode.message}</Typography>}
                            </FormControl>
                         </Grid>
                          <Grid item xs={12} sm={6}>
                             <TextField fullWidth label="Zona / Barrio" {...register("locationScope.zone")} disabled={loading} />
                         </Grid>


                        {/* Campo isPublished (sin cambios) */}
                        <Grid item xs={12}> <Controller name="isPublished" control={control} render={({ field }) => (<FormControlLabel control={<Switch {...field} checked={field.value} />} label="Publicada" disabled={loading}/> )}/> </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px'}}>
                    <Button onClick={onClose} disabled={loading} color="inherit">Cancelar</Button>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit"/> : (isEditing ? 'Guardar Cambios' : 'Crear Noticia')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default NewsFormModal;