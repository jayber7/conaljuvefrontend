// src/components/Admin/NewsFormModal.jsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, CircularProgress, Alert, Switch, FormControlLabel, Box, Select, MenuItem, FormControl, InputLabel, Typography, Paper, Divider,ToggleButton, ToggleButtonGroup  } from '@mui/material'; // Añadir Typography si no estaba
import api from '../../services/api';
import DescriptionIcon from '@mui/icons-material/Description'; // Icono para PDF
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'; // Otro icono para PDF
import UploadFileIcon from '@mui/icons-material/UploadFile'; // Icono genérico de subida
// Opcional: ReactQuill para editor
import PhotoCamera from '@mui/icons-material/PhotoCamera'; // Icono para subir foto

const NewsFormModal = ({ open, onClose, onSaveSuccess, initialData }) => {
    const isEditing = !!initialData;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [departments, setDepartments] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [loadingLocation, setLoadingLocation] = useState({ dep: false, prov: false, mun: false });
    const [contentType, setContentType] = useState('text'); // 'text' o 'pdf'
    const [pdfFileName, setPdfFileName] = useState(''); // Para mostrar nombre del PDF seleccionado

    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
        defaultValues: { // Usar códigos numéricos o '' como default
            title: '', summary: '', content: '', imageUrl: '',
            publicationDate: new Date().toISOString().split('T')[0],
            tags: [],
            locationScope: { departmentCode: '', provinceCode: '', municipalityCode: '', zone: '' },
            isPublished: true,
            newsImage: null,
            newsPdf: null,
        }
    });
      // Limpiar campos al cambiar tipo de contenido
      const handleContentTypeChange = (type) => {
        setContentType(type);
        if (type === 'pdf') {
            setValue('content', ''); // Borrar contenido de texto
        } else {
            setValue('newsPdf', null); // Borrar archivo PDF seleccionado
            setPdfFileName('');
        }
     };

     // Manejar selección de PDF
    const handlePdfChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setValue('newsPdf', file); // Guardar archivo en RHF
            setPdfFileName(file.name);
            setContentType('pdf'); // Cambiar automáticamente a tipo PDF
             setValue('content', ''); // Borrar contenido de texto
        } else {
            setValue('newsPdf', null);
            setPdfFileName('');
            // No cambiar contentType automáticamente al deseleccionar
        }
    };
     // Manejar selección de Imagen (similar)
    const handleImageChange = (event) => {
         const file = event.target.files[0];
         if (file) { setValue('newsImage', file); /* ... previsualización opcional ... */ }
         else { setValue('newsImage', null); /* ... limpiar previsualización ... */ }
    }
    // Observar códigos para cargar dependientes
    const selectedDepartmentCode = watch('locationScope.departmentCode');
    const selectedProvinceCode = watch('locationScope.provinceCode');

    // --- Cargar datos iniciales y ubicaciones ---
    useEffect(() => {
        if (open) {
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
                if (initialData.pdfUrl && !initialData.content) {
                    setContentType('pdf');
                    setPdfFileName(initialData.pdfUrl.substring(initialData.pdfUrl.lastIndexOf('/') + 1)); // Extraer nombre de URL (aproximado)
                } else {
                    setContentType('text');
                    setPdfFileName('');
                }
                 setValue('newsImage', null); // Resetear campos de archivo
                 setValue('newsPdf', null);
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
                setContentType('text'); // Default a texto
                setPdfFileName('');
                setValue('newsImage', null);
                setValue('newsPdf', null);
            }
        }
        if (open) {
            setError('');
            fetchInitialData();
        }
        };
    }, [open, isEditing, initialData, reset, setValue]);

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
        setLoading(true); setError('');
        const formData = new FormData();

        // Campos de texto y booleanos/números
        formData.append('title', data.title);
        formData.append('summary', data.summary);
        // Añadir content SOLO si el tipo es 'text'
        if (contentType === 'text' && data.content) {
            formData.append('content', data.content);
        }
        if (data.publicationDate) formData.append('publicationDate', data.publicationDate);
        if (data.tags) { // Enviar tags como array (si el backend lo espera así)
            const tagsArray = typeof data.tags === 'string' ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : (data.tags || []);
            tagsArray.forEach(tag => formData.append('tags[]', tag)); // Enviar como array
        }
        formData.append('isPublished', data.isPublished);

        // Ubicación
        if (data.locationScope.departmentCode) formData.append('locationScope[departmentCode]', Number(data.locationScope.departmentCode));
        // ... (provinceCode, municipalityCode, zone) ...

        // Archivos (añadir solo si existen en el estado de RHF)
        if (data.newsImage instanceof File) {
            formData.append('newsImage', data.newsImage);
        }
        if (contentType === 'pdf' && data.newsPdf instanceof File) { // Enviar PDF solo si el tipo es PDF y hay archivo
            formData.append('newsPdf', data.newsPdf);
        }

        try {
            if (isEditing) {
                // Para PUT con FormData, axios puede necesitar ayuda o usar POST con _method
                // Opción 1: Usar POST y un campo _method (requiere ajuste backend)
                // formData.append('_method', 'PUT');
                // await api.post(`/news/${initialData._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

                // Opción 2: Axios debería manejar PUT con FormData moderno (probar)
                await api.put(`/news/${initialData._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            } else {
                await api.post('/news', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            }
            onSaveSuccess();
        } catch (err) { /* ... manejo de error ... */ }
        finally { setLoading(false); }
    };

return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth scroll="paper"> {/* Cambiado a lg para más espacio horizontal */}
            <DialogTitle>{isEditing ? 'Editar Noticia' : 'Crear Nueva Noticia'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                {/* Usar dividers para scrollable content */}
                <DialogContent dividers sx={{ bgcolor: 'grey.50' }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Grid container spacing={3}> {/* Grid principal */}

                        {/* --- COLUMNA IZQUIERDA (Campos Principales) --- */}
                        <Grid item xs={12} md={7}> {/* Ocupa más espacio */}
                             <Paper elevation={1} sx={{ p: 2.5, mb: 2 }}> {/* Grupo Visual */}
                                <Typography variant="h6" gutterBottom>Información Básica</Typography>
                                <Grid container spacing={2}>
                                     <Grid item xs={12}>
                                        <TextField fullWidth label="Título*" {...register("title", { required: "Título requerido" })} error={!!errors.title} helperText={errors.title?.message} disabled={loading} variant="outlined" size="small"/>
                                    </Grid>
                                     <Grid item xs={12}>
                                        <TextField fullWidth label="Resumen*" multiline rows={4} {...register("summary", { required: "Resumen requerido" })} error={!!errors.summary} helperText={errors.summary?.message} disabled={loading} variant="outlined" size="small"/>
                                    </Grid>
                                     <Grid item xs={12} sm={6}>
                                         <TextField fullWidth label="Fecha de Publicación*" type="date" InputLabelProps={{ shrink: true }} {...register("publicationDate", { required: "Fecha requerida"})} error={!!errors.publicationDate} helperText={errors.publicationDate?.message} disabled={loading} size="small"/>
                                     </Grid>
                                     <Grid item xs={12} sm={6}>
                                        <TextField fullWidth label="Etiquetas (separadas por coma)" {...register("tags")} error={!!errors.tags} helperText={errors.tags?.message || "Ej: Seguridad, El Alto"} disabled={loading} size="small"/>
                                     </Grid>
                                </Grid>
                             </Paper>

                            <Paper elevation={1} sx={{ p: 2.5 }}> {/* Grupo Visual */}
                                 <Typography variant="h6" gutterBottom>Contenido Principal</Typography>
                                 {/* Toggle Buttons para elegir tipo */}
                                 <ToggleButtonGroup
                                      value={contentType}
                                      exclusive
                                      onChange={(event, newType) => { if (newType !== null) { handleContentTypeChange(newType); } }}
                                      aria-label="Tipo de contenido principal"
                                      size="small"
                                      color="primary"
                                      sx={{ mb: 2 }}
                                      disabled={loading}
                                    >
                                      <ToggleButton value="text" aria-label="escribir texto">
                                        <DescriptionIcon sx={{mr: 1}}/> Escribir Texto
                                      </ToggleButton>
                                      <ToggleButton value="pdf" aria-label="subir pdf">
                                         <PictureAsPdfIcon sx={{mr: 1}}/> Subir PDF
                                      </ToggleButton>
                                </ToggleButtonGroup>

                                {/* Campo de Contenido Condicional */}
                                {contentType === 'text' ? (
                                     <TextField fullWidth label="Contenido (Texto)*" multiline rows={10} {...register("content", { required: contentType === 'text' ? 'Contenido requerido si no sube PDF' : false })} error={!!errors.content} helperText={errors.content?.message} disabled={loading} variant="outlined"/>
                                ) : (
                                    <Box>
                                        <Button variant="outlined" component="label" startIcon={<UploadFileIcon />} fullWidth disabled={loading}>
                                             {pdfFileName ? `Archivo: ${pdfFileName}` : 'Seleccionar PDF*'}
                                             <input type="file" hidden accept="application/pdf" onChange={handlePdfChange} />
                                         </Button>
                                         {errors.newsPdf && <Typography color="error" variant="caption" sx={{mt: 1}}>{errors.newsPdf.message}</Typography>}
                                         {isEditing && initialData?.pdfUrl && !pdfFileName && ( <Typography /* ... Link PDF actual ... */ /> )}
                                    </Box>
                                )}
                             </Paper>
                        </Grid>

                        {/* --- COLUMNA DERECHA (Multimedia, Ámbito, Publicación) --- */}
                        <Grid item xs={12} md={5}>
                             <Paper elevation={1} sx={{ p: 2.5, mb: 2 }}> {/* Grupo Visual */}
                                 <Typography variant="h6" gutterBottom>Multimedia</Typography>
                                  <Typography variant="body2" color="textSecondary" sx={{mb: 1}}>Imagen de Portada (Opcional)</Typography>
                                  <Button variant="outlined" component="label" startIcon={<PhotoCamera />} size="small" sx={{mb: 1}}>
                                      Seleccionar Imagen
                                      <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                  </Button>
                                  {watch('newsImage') && <Typography variant="caption" sx={{ml: 2}}>{watch('newsImage').name}</Typography>}
                                  {/* Aquí podrías añadir la previsualización si la implementas */}
                             </Paper>

                             <Paper elevation={1} sx={{ p: 2.5, mb: 2 }}> {/* Grupo Visual */}
                                 <Typography variant="h6" gutterBottom>Ámbito</Typography>
                                 <Typography variant="body2" color="textSecondary" sx={{mb: 1}}>Ubicación de la Noticia (Opcional)</Typography>
                                 <Grid container spacing={2}>
                                     <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth size="small" error={!!errors.locationScope?.departmentCode} disabled={loadingLocation.dep || loading}>
                                            <InputLabel>Departamento</InputLabel>
                                            <Controller name="locationScope.departmentCode" control={control} render={({ field }) => ( <Select label="Departamento" {...field}> <MenuItem value=""><em>(Opcional)</em></MenuItem> {departments.map(d => <MenuItem key={d.code} value={d.code}>{d.name}</MenuItem>)} </Select> )}/>
                                            {errors.locationScope?.departmentCode && <FormHelperText>{errors.locationScope.departmentCode.message}</FormHelperText>}
                                         </FormControl>
                                     </Grid>
                                     <Grid item xs={12} sm={6}>
                                         <FormControl fullWidth size="small" error={!!errors.locationScope?.provinceCode} disabled={!selectedDepartmentCode || loadingLocation.prov || loading}>
                                             <InputLabel>Provincia</InputLabel>
                                              <Controller name="locationScope.provinceCode" control={control} render={({ field }) => (<Select label="Provincia" {...field}><MenuItem value=""><em>(Opcional)</em></MenuItem>{provinces.map(p => <MenuItem key={p.code} value={p.code}>{p.name}</MenuItem>)}</Select>)}/>
                                              {errors.locationScope?.provinceCode && <FormHelperText>{errors.locationScope.provinceCode.message}</FormHelperText>}
                                         </FormControl>
                                     </Grid>
                                     <Grid item xs={12} sm={6}>
                                         <FormControl fullWidth size="small" error={!!errors.locationScope?.municipalityCode} disabled={!selectedProvinceCode || loadingLocation.mun || loading}>
                                            <InputLabel>Municipio</InputLabel>
                                             <Controller name="locationScope.municipalityCode" control={control} render={({ field }) => (<Select label="Municipio" {...field}><MenuItem value=""><em>(Opcional)</em></MenuItem>{municipalities.map(m => <MenuItem key={m.code} value={m.code}>{m.name}</MenuItem>)}</Select>)}/>
                                             {errors.locationScope?.municipalityCode && <FormHelperText>{errors.locationScope.municipalityCode.message}</FormHelperText>}
                                         </FormControl>
                                     </Grid>
                                      <Grid item xs={12} sm={6}>
                                         <TextField fullWidth label="Zona / Barrio" size="small" {...register("locationScope.zone")} disabled={loading} />
                                     </Grid>
                                 </Grid>
                            </Paper>

                            <Paper elevation={1} sx={{ p: 2.5 }}> {/* Grupo Visual */}
                                 <Typography variant="h6" gutterBottom>Publicación</Typography>
                                  <Controller name="isPublished" control={control} render={({ field }) => (<FormControlLabel control={<Switch {...field} checked={field.value} />} label="Publicada (Visible)" disabled={loading}/> )}/>
                             </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px', borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
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