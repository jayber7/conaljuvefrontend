import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, CircularProgress, Alert, Switch, FormControlLabel, Box, Select, MenuItem, FormControl, InputLabel, Chip, Typography } from '@mui/material';
import api from '../../services/api';
// Opcional: import ReactQuill from 'react-quill'; // Para editor enriquecido
// Opcional: import 'react-quill/dist/quill.snow.css';

const NewsFormModal = ({ open, onClose, onSaveSuccess, initialData }) => {
    const isEditing = !!initialData;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // Estados para selects de ubicación (similar a RegisterModal)
    const [departments, setDepartments] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            summary: '',
            content: '',
            imageUrl: '',
            publicationDate: new Date().toISOString().split('T')[0], // Fecha actual por defecto
            tags: [],
            locationScope: { department: '', province: '', municipality: '', zone: '' },
            isPublished: true,
        }
    });

    const selectedDepartment = watch('locationScope.department');
    const selectedProvince = watch('locationScope.province');

    // Efecto para cargar datos iniciales y resetear
    useEffect(() => {
        if (open) {
            setError(''); // Limpiar errores al abrir
             // Cargar departamentos para los selects
            const fetchDeps = async () => {
                setLoadingLocation(true);
                try {
                     const res = await api.get('/locations/departments');
                     setDepartments(res.data.data.departments || []);
                } catch (err) { console.error(err); }
                finally { setLoadingLocation(false); }
            }
            fetchDeps();

            if (isEditing && initialData) {
                 // Poblar formulario con datos existentes
                 reset({
                    title: initialData.title || '',
                    summary: initialData.summary || '',
                    content: initialData.content || '',
                    imageUrl: initialData.imageUrl || '',
                    publicationDate: initialData.publicationDate ? new Date(initialData.publicationDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    tags: initialData.tags || [],
                    locationScope: {
                        department: initialData.locationScope?.department || '',
                        province: initialData.locationScope?.province || '',
                        municipality: initialData.locationScope?.municipality || '',
                        zone: initialData.locationScope?.zone || ''
                    },
                    isPublished: initialData.isPublished !== undefined ? initialData.isPublished : true,
                });
                // Nota: Puede necesitar cargar provincias/municipios aquí si depto/prov están seteados
            } else {
                 // Resetear a valores por defecto si es modo creación
                reset({
                    title: '', summary: '', content: '', imageUrl: '',
                    publicationDate: new Date().toISOString().split('T')[0],
                    tags: [], locationScope: { department: '', province: '', municipality: '', zone: '' },
                    isPublished: true,
                });
            }
        }
    }, [open, isEditing, initialData, reset]);


    // --- Lógica para cargar Provincias/Municipios (similar a RegisterModal) ---
    useEffect(() => {
        if (selectedDepartment && open) { // Solo cargar si el modal está abierto
            const fetchProvs = async () => { /* ... fetch provincias ... */ setProvinces(/*...*/); };
            fetchProvs();
             setValue('locationScope.province', ''); // Resetear al cambiar depto
             setValue('locationScope.municipality', '');
             setMunicipalities([]);
        } else { setProvinces([]); setMunicipalities([]); }
    }, [selectedDepartment, open, setValue]);

     useEffect(() => {
         if (selectedProvince && open) {
            const fetchMuns = async () => { /* ... fetch municipios ... */ setMunicipalities(/*...*/);};
            fetchMuns();
             setValue('locationScope.municipality', ''); // Resetear al cambiar prov
         } else { setMunicipalities([]); }
     }, [selectedProvince, open, setValue]);
    // --- Fin Lógica Ubicación ---


    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        // Convertir tags de string separado por comas a array (si se usa un TextField)
         const formattedData = {
             ...data,
             tags: typeof data.tags === 'string' ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : (data.tags || []),
             // Asegurar que locationScope no envíe campos vacíos si no se seleccionaron
             locationScope: {
                 department: data.locationScope.department || undefined,
                 province: data.locationScope.province || undefined,
                 municipality: data.locationScope.municipality || undefined,
                 zone: data.locationScope.zone || undefined,
             }
         };


        try {
            if (isEditing) {
                await api.put(`/news/${initialData._id}`, formattedData);
            } else {
                await api.post('/news', formattedData);
            }
            onSaveSuccess(); // Llama a la función del padre para recargar/cerrar
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
                <DialogContent dividers> {/* Hace scrollable el contenido */}
                     {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Grid container spacing={2}>
                        {/* --- Campos Principales --- */}
                        <Grid item xs={12}>
                            <TextField fullWidth label="Título*" {...register("title", { required: "Título requerido" })} error={!!errors.title} helperText={errors.title?.message} disabled={loading} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Resumen*" multiline rows={3} {...register("summary", { required: "Resumen requerido" })} error={!!errors.summary} helperText={errors.summary?.message} disabled={loading} />
                        </Grid>
                        <Grid item xs={12}>
                            {/* --- Editor Enriquecido (Opcional) --- */}
                            {/* <InputLabel sx={{mb: 1}}>Contenido*</InputLabel>
                            <Controller
                                name="content"
                                control={control}
                                rules={{ required: 'Contenido requerido' }}
                                render={({ field }) => <ReactQuill theme="snow" value={field.value} onChange={field.onChange} />}
                            />
                            {errors.content && <Typography color="error" variant="caption">{errors.content.message}</Typography>} */}

                            {/* --- O TextField simple --- */}
                              <TextField fullWidth label="Contenido*" multiline rows={8} {...register("content", { required: "Contenido requerido" })} error={!!errors.content} helperText={errors.content?.message} disabled={loading} />
                        </Grid>
                         <Grid item xs={12} md={6}>
                            <TextField fullWidth label="URL de Imagen" type="url" {...register("imageUrl", { pattern: { value: /^(https?:\/\/).*/i, message: "URL inválida"} })} error={!!errors.imageUrl} helperText={errors.imageUrl?.message} disabled={loading} />
                        </Grid>
                         <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Fecha de Publicación*"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                {...register("publicationDate", { required: "Fecha requerida"})}
                                error={!!errors.publicationDate}
                                helperText={errors.publicationDate?.message}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Etiquetas (separadas por coma)"
                                {...register("tags")} // Validación puede ser más compleja
                                error={!!errors.tags}
                                helperText={errors.tags?.message || "Ej: Seguridad, El Alto, Elecciones"}
                                disabled={loading}
                            />
                            {/* O usar un componente de Tags como MUI ChipInput */}
                        </Grid>

                        {/* --- Ubicación --- */}
                         <Grid item xs={12}> <Typography variant="subtitle2" sx={{mt: 1}}>Ámbito de la Noticia (Opcional)</Typography></Grid>
                          <Grid item xs={12} sm={6} md={4}>
                              <FormControl fullWidth error={!!errors.locationScope?.department} disabled={loadingLocation}>
                                  <InputLabel>Departamento</InputLabel>
                                   <Controller name="locationScope.department" control={control} render={({ field }) => (
                                       <Select label="Departamento" {...field} >
                                            <MenuItem value=""><em>(Opcional)</em></MenuItem>
                                            {departments.map(d => <MenuItem key={d.id || d.name} value={d.name}>{d.name}</MenuItem>)}
                                       </Select>
                                   )} />
                              </FormControl>
                          </Grid>
                           {/* Añadir selects para Provincia y Municipio (similar a RegisterModal) */}
                           <Grid item xs={12} sm={6} md={4}> {/* Placeholder Provincia */}
                              <FormControl fullWidth disabled={!selectedDepartment || loading}> <InputLabel>Provincia</InputLabel><Select label="Provincia" value=""><MenuItem value=""><em>(Selecciona Depto)</em></MenuItem></Select></FormControl>
                           </Grid>
                            <Grid item xs={12} sm={6} md={4}> {/* Placeholder Municipio */}
                               <FormControl fullWidth disabled={!selectedProvince || loading}> <InputLabel>Municipio</InputLabel><Select label="Municipio" value=""><MenuItem value=""><em>(Selecciona Prov)</em></MenuItem></Select></FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}> {/* Placeholder Zona */}
                                <TextField fullWidth label="Zona / Barrio" {...register("locationScope.zone")} disabled={loading} />
                            </Grid>


                        <Grid item xs={12}>
                             <Controller
                                name="isPublished"
                                control={control}
                                render={({ field }) => (
                                     <FormControlLabel
                                        control={<Switch {...field} checked={field.value} />}
                                        label="Publicada (Visible en el portal)"
                                        disabled={loading}
                                    />
                                )}
                            />
                        </Grid>
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