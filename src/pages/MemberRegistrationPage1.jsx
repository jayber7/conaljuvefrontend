// src/pages/MemberRegistrationPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Container, Box, Typography, Paper, Grid, TextField, Button, Select, MenuItem,
    FormControl, InputLabel, FormHelperText, CircularProgress, Alert, Avatar,
    IconButton, Tooltip, Divider, Link // Link podría usarse si quieres volver a inicio
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale/es';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import jsPDF from 'jspdf';
import CameraModal from '../components/Auth/CameraModal'; // Asumiendo que lo tienes

// Códigos válidos (puedes obtenerlos de la API si prefieres)
const validDepartmentCodes = ['LP', 'CB', 'SC', 'OR', 'PO', 'CH', 'TJ', 'BE', 'PA'];

const MemberRegistrationPage = () => {
    // Ya no necesitamos useAuth aquí
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successData, setSuccessData] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [loadingLocation, setLoadingLocation] = useState({ dep: false, prov: false, mun: false, suggestion: false });
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [cameraModalOpen, setCameraModalOpen] = useState(false);
    const [cameraError, setCameraError] = useState('');
    const [anchorElPhotoMenu, setAnchorElPhotoMenu] = useState(null);

    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors, isDirty } } = useForm({
        // Valores iniciales para el registro de MIEMBRO
        defaultValues: {
            fullName: '',
            idCard: '',
            idCardExtension: '', // Debe ser string aquí por el Select ''
            birthDate: null,
            gender: '',
            phoneNumber: '',
            location: { departmentCode: '', provinceCode: '', municipalityCode: '', zone: '' },
            neighborhoodCouncilName: '',
            memberRoleInCouncil: '',
            memberPhoto: null,
        }
    });

    const selectedDepartmentCode = watch('location.departmentCode');
    const selectedProvinceCode = watch('location.provinceCode');

    // --- Fetch Ubicaciones (Solo al montar la página) ---
    useEffect(() => {
        const fetchDepartments = async () => { /* ... como antes ... */ };
        fetchDepartments();
    }, []); // Ejecutar solo una vez

    useEffect(() => { /* Fetch Provincias */ if (selectedDepartmentCode) { /* ... */ } else { setProvinces([]); setMunicipalities([]); /* ... */ } }, [selectedDepartmentCode, setValue]);
    useEffect(() => { /* Fetch Municipios */if (selectedProvinceCode) { /* ... */ } else { setMunicipalities([]); /* ... */ }}, [selectedProvinceCode, setValue]);
    // --- Fin Fetch ---


    // --- Handlers Cámara y Archivo (sin cambios funcionales) ---
    const handlePhotoMenuOpen = (event) => { setAnchorElPhotoMenu(event.currentTarget); };
    const handlePhotoMenuClose = () => { setAnchorElPhotoMenu(null); };
    const handleUploadClick = () => { handlePhotoMenuClose(); fileInputRef.current?.click(); };
    const handleFileChange = (event) => { /* ... */ };
    const handleOpenCameraModal = () => { handlePhotoMenuClose(); /*...*/ setCameraModalOpen(true); };
    const handleCloseCameraModal = () => { setCameraModalOpen(false); };
    const handlePictureTaken = (pictureFile) => { /* ... */ setIsCameraOpen(false); };
    const handleRemovePicture = () => { /* ... */ };
    // --- Fin Handlers ---


    // --- Sugerencia Ubicación (sin cambios funcionales) ---
    const handleSuggestLocation = () => { /* ... */ };
    // --- Fin Sugerencia ---


    // --- onSubmit para REGISTRAR MIEMBRO ---
    const onSubmit = async (data) => {
        setLoading(true); setError(''); setSuccessData(null);
        const formData = new FormData();

        // Validar que los campos requeridos de ubicación no estén vacíos
        if (!data.location.departmentCode || !data.location.provinceCode || !data.location.municipalityCode || !data.location.zone) {
            setError("Por favor, complete toda la información de Ubicación (Departamento, Provincia, Municipio, Zona).");
            setLoading(false);
            return;
        }
         if (!data.idCard || !data.idCardExtension) {
             setError("El número de Carnet de Identidad y su Extensión son requeridos.");
             setLoading(false);
             return;
         }
          if (!data.neighborhoodCouncilName || !data.memberRoleInCouncil) {
             setError("El Nombre de la Junta Vecinal y su Cargo son requeridos.");
             setLoading(false);
             return;
         }

        // Añadir todos los campos
        formData.append('fullName', data.fullName);
        formData.append('idCard', data.idCard);
        formData.append('idCardExtension', data.idCardExtension); // Se envía el código corto (LP, CB...)
        if (data.birthDate) formData.append('birthDate', data.birthDate.toISOString().split('T')[0]);
        const genderValue = data.gender === 'male' ? true : (data.gender === 'female' ? false : undefined);
        if (genderValue !== undefined) formData.append('gender', genderValue);
        if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
        formData.append('location[departmentCode]', Number(data.location.departmentCode));
        formData.append('location[provinceCode]', Number(data.location.provinceCode));
        formData.append('location[municipalityCode]', Number(data.location.municipalityCode));
        formData.append('location[zone]', data.location.zone);
        formData.append('neighborhoodCouncilName', data.neighborhoodCouncilName);
        formData.append('memberRoleInCouncil', data.memberRoleInCouncil);
        if (data.memberPhoto instanceof File) {
            formData.append('memberPhoto', data.memberPhoto);
        }

        try {
            // Llamar al endpoint específico de registro de miembros
            const response = await api.post('/members/register', formData, {
                 headers: { 'Content-Type': 'multipart/form-data' }
            });
            const regData = response.data.data;
            // Guardar datos para el PDF y mostrar mensaje éxito
             const dataForPdf = {
                 fullName: regData.fullName,
                 registrationCode: regData.registrationCode,
                 idCard: regData.idCard,
                 idCardExtension: regData.idCardExtension, // Usar la extensión guardada
                 departmentName: departments.find(d => d.code == data.location.departmentCode)?.name || '',
                 provinceName: provinces.find(p => p.code == data.location.provinceCode)?.name || '',
                 municipalityName: municipalities.find(m => m.code == data.location.municipalityCode)?.name || '',
                 zone: data.location.zone,
                 neighborhoodCouncilName: data.neighborhoodCouncilName,
                 memberRoleInCouncil: data.memberRoleInCouncil,
                 registrationDate: new Date().toLocaleString('es-ES')
             };
            setSuccessData(dataForPdf);
            reset(); // Limpiar formulario
            setProfilePicPreview(null);
            window.scrollTo(0, 0);

        } catch (err) { setError(err.response?.data?.message || 'Error al enviar el registro.'); console.error(err); }
        finally { setLoading(false); }
    };

    // --- Función Generar PDF (sin cambios) ---
    const generatePdf = () => { /* ... como antes, usando successData ... */ };
    // --- Fin ---

    // Variable para imagen a mostrar (solo preview aquí)
    const displayImageUrl = profilePicPreview || undefined;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            {/* Usar Container como página */}
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h1" component="h1" gutterBottom align="center">
                    Registro de Miembros CONALJUVE
                </Typography>
                 <Typography align='center' paragraph sx={{ mb: 4 }}>
                     Complete el siguiente formulario para registrarse como miembro oficial de su junta vecinal.
                     Su registro será revisado por un administrador.
                 </Typography>

                 <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                     {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                     {successData && ( <Alert severity="success" sx={{ mb: 3 }}>{successData}</Alert>)}

                     {/* Ocultar formulario si hubo éxito */}
                     {!successData && (
                         <Grid container spacing={3}>
                            {/* --- Datos Personales --- */}
                            <Grid item xs={12}>
                                <Paper sx={{ p: 2.5 }} variant="outlined">
                                    <Typography variant="h6" gutterBottom>Datos Personales</Typography>
                                    <Grid container spacing={2}>
                                        {/* --- Todos los campos ahora son para entrada nueva --- */}
                                        <Grid item xs={12}><TextField fullWidth size="small" label="Nombre Completo*" {...register("fullName", { required: true })} error={!!errors.fullName} helperText={errors.fullName?.message} disabled={loading}/> </Grid>
                                        <Grid item xs={12} sm={7}><TextField fullWidth size="small" label="Carnet Identidad*" {...register("idCard", { required: "CI requerido" })} error={!!errors.idCard} helperText={errors.idCard?.message} disabled={loading}/> </Grid>
                                        <Grid item xs={12} sm={5}><FormControl required fullWidth size="small" error={!!errors.idCardExtension} disabled={loading}><InputLabel>Extensión*</InputLabel><Controller name="idCardExtension" rules={{ required: "Ext. requerida"}} control={control} render={({ field }) => ( <Select label="Extensión*" {...field}> <MenuItem value=""><em>--</em></MenuItem> {departments.map((dept) => ( <MenuItem key={dept.code} value={dept.abbreviation || dept.code}>{dept.abbreviation || dept.code}</MenuItem> ))} </Select> )}/></FormControl> </Grid>
                                        <Grid item xs={12} sm={6}><Controller name="birthDate" control={control} render={({ field }) => (<DatePicker slotProps={{ textField: { fullWidth: true, size: 'small', error: !!errors.birthDate, helperText: errors.birthDate?.message } }} label="Fecha Nacimiento" {...field} value={field.value || null} disabled={loading} disableFuture/> )}/> </Grid>
                                        <Grid item xs={12} sm={6}><FormControl fullWidth size="small" error={!!errors.gender} disabled={loading}><InputLabel>Género</InputLabel><Controller name="gender" control={control} render={({ field }) => (<Select label="Género" {...field}><MenuItem value=""><em>(Opcional)</em></MenuItem><MenuItem value="male">Varón</MenuItem><MenuItem value="female">Mujer</MenuItem></Select>)} /></FormControl> </Grid>
                                        <Grid item xs={12}><TextField fullWidth size="small" label="Número Celular (Opcional)" {...register("phoneNumber")} error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message} disabled={loading}/> </Grid>
                                    </Grid>
                                </Paper>
                             </Grid>

                             {/* --- Foto Miembro --- */}
                             <Grid item xs={12}>
                                  <Paper sx={{ p: 2.5 }} variant="outlined">
                                      <Typography variant="h6" gutterBottom>Foto del Miembro (Opcional)</Typography>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                          <Avatar src={displayImageUrl} sx={{ width: 80, height: 80, bgcolor: 'grey.300' }}>
                                              {!displayImageUrl && <PersonIcon sx={{ fontSize: 40 }} />}
                                          </Avatar>
                                          <Box>
                                             {/* Usar ID diferente para el input file */}
                                             <input type="file" accept="image/*" onChange={handleFileChange} id="member-photo-file" style={{ display: 'none' }} ref={fileInputRef} {...register('memberPhoto')}/>
                                             <label htmlFor="member-photo-file">
                                                <Button variant="outlined" component="span" startIcon={<UploadFileIcon />} size="small" disabled={loading}>
                                                    {watch('memberPhoto') ? watch('memberPhoto').name : 'Subir Foto'}
                                                </Button>
                                             </label>
                                              {/* <Button variant="outlined" startIcon={<CameraAltIcon />} onClick={handleOpenCameraModal} disabled={loading} size="small" sx={{ml: 1}}>Usar Cámara</Button> */}
                                             {errors.memberPhoto && <FormHelperText error>{errors.memberPhoto.message}</FormHelperText>}
                                           </Box>
                                      </Box>
                                 </Paper>
                             </Grid>

                             {/* --- Datos Junta Vecinal y Ubicación --- */}
                             <Grid item xs={12}>
                                  <Paper sx={{ p: 2.5 }} variant="outlined">
                                      <Typography variant="h6" gutterBottom>Información de Junta Vecinal y Ubicación</Typography>
                                      <Grid container spacing={2}>
                                           <Grid item xs={12} sm={6}><TextField required fullWidth size="small" label="Nombre Junta Vecinal*" {...register("neighborhoodCouncilName", { required: true })} error={!!errors.neighborhoodCouncilName} helperText={errors.neighborhoodCouncilName?.message} disabled={loading}/></Grid>
                                           <Grid item xs={12} sm={6}><TextField required fullWidth size="small" label="Cargo en la Junta*" {...register("memberRoleInCouncil", { required: true })} error={!!errors.memberRoleInCouncil} helperText={errors.memberRoleInCouncil?.message} disabled={loading}/></Grid>
                                           <Grid item xs={12}> <Divider sx={{ my: 1 }}><Typography variant="caption">Ubicación de la Junta*</Typography></Divider></Grid>
                                           <Grid item xs={12}><Button variant="outlined" size="small" startIcon={<LocationOnIcon />} onClick={handleSuggestLocation} disabled={loadingLocation.suggestion || loading}>Sugerir Ubicación (Opcional)</Button></Grid>
                                           <Grid item xs={12} sm={6} md={4}><FormControl required fullWidth size="small" /*...*/><InputLabel>Departamento*</InputLabel><Controller name="location.departmentCode" rules={{ required: true}} /*...*/ /></FormControl> </Grid>
                                           <Grid item xs={12} sm={6} md={4}><FormControl required fullWidth size="small" /*...*/><InputLabel>Provincia*</InputLabel><Controller name="location.provinceCode" rules={{ required: true}} /*...*/ /></FormControl> </Grid>
                                           <Grid item xs={12} sm={6} md={4}><FormControl required fullWidth size="small" /*...*/><InputLabel>Municipio*</InputLabel><Controller name="location.municipalityCode" rules={{ required: true}} /*...*/ /></FormControl> </Grid>
                                           <Grid item xs={12} sm={6}><TextField required fullWidth label="Zona / Barrio*" size="small" {...register("location.zone", { required: true })} error={!!errors.location?.zone} helperText={errors.location?.zone?.message} disabled={loading} /></Grid>
                                       </Grid>
                                  </Paper>
                             </Grid>

                             {/* Botón Submit */}
                             <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                  <Button type="submit" variant="contained" color="primary" disabled={loading}>
                                      {loading ? <CircularProgress size={24} color="inherit"/> : 'Enviar Registro de Miembro'}
                                  </Button>
                             </Grid>

                         </Grid>
                     )}
                 </form>
            </Container>

            {/* Modal de Cámara (si decides usarlo) */}
             <CameraModal
                open={cameraModalOpen}
                onClose={handleCloseCameraModal}
                onPictureTaken={handlePictureTaken}
            />
        </LocalizationProvider>
    );
};

export default MemberRegistrationPage; // Asegúrate que el nombre coincida