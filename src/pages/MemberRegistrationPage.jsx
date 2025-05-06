// src/pages/MemberRegistrationPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    Container, Box, Typography, Paper, Grid, TextField, Button, Select, MenuItem,
    FormControl, InputLabel, FormHelperText, CircularProgress, Alert, Avatar,
    IconButton, Tooltip, Divider, Menu 
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale/es';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CameraModal from '../components/Auth/CameraModal'; // Asumiendo que lo tienes
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import DeleteIcon from '@mui/icons-material/Delete'; // Para quitar foto
 
import UploadFileIcon from '@mui/icons-material/UploadFile';
import jsPDF from 'jspdf';
// import CameraModal from '../components/Auth/CameraModal'; // Asumiendo que tienes este modal
const DEFAULT_MEMBER_ROLE_CODE = 21; // <-- ¡¡AJUSTA ESTE CÓDIGO!!

const MemberRegistrationPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successData, setSuccessData] = useState(null); // Guardar datos para PDF y mensaje
    const [departments, setDepartments] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [municipalities, setMunicipalities] = useState([]);
    const [loadingLocation, setLoadingLocation] = useState({ dep: false, prov: false, mun: false, suggestion: false });
    const [isCameraOpen, setIsCameraOpen] = useState(false); // Para cámara (si usas modal)
    const [cameraError, setCameraError] = useState('');
    const [profilePicPreview, setProfilePicPreview] = useState(null); // <-- Estado para preview
    const fileInputRef = useRef(null); // <-- Ref para input file
    const [cameraModalOpen, setCameraModalOpen] = useState(false); // <-- Estado modal cámara
    const [anchorElPhotoMenu, setAnchorElPhotoMenu] = useState(null); // <-- Estado menú avatar
    const [councilRoles, setCouncilRoles] = useState([]); // <-- NUEVO ESTADO
    const [loadingRoles, setLoadingRoles] = useState(false); // <-- NUEVO ESTADO
    // const [cameraStream, setCameraStream] = useState(null); // Manejado dentro de CameraModal
    // const videoRef = useRef(null);
    // const canvasRef = useRef(null);


    const { register, handleSubmit, control, watch, setValue, reset, formState: { errors, isDirty } } = useForm({
        // Valores iniciales para el formulario de MIEMBRO
        defaultValues: {
            fullName: '',
            idCard: '',
            idCardExtension: '',
            birthDate: null,
            sex: '',
            phoneNumber: '',
            location: { departmentCode: '', provinceCode: '', municipalityCode: '', zone: '', neighborhood:'', street:'' },
            neighborhoodCouncilName: '',
            memberRoleInCouncilCode: DEFAULT_MEMBER_ROLE_CODE,
            memberPhoto: null, // Para el archivo de foto
        }
    });

    const selectedDepartmentCode = watch('location.departmentCode');
    const selectedProvinceCode = watch('location.provinceCode');

     // --- Fetch Ubicaciones (Similar a modales anteriores) ---
     useEffect(() => {
        const fetchData  = async () => {
            setLoadingLocation(prev => ({ ...prev, dep: true }));
            setLoadingRoles(true); // Iniciar carga roles
            try {
                // Ejecutar en paralelo
                const [deptRes, rolesRes] = await Promise.all([
                    api.get('/locations/departments'),
                    api.get('/locations/council-roles') // <-- Llamar a nueva API
                ]);
                setDepartments(deptRes.data.data.departments || []);
                setCouncilRoles(rolesRes.data.data.councilRoles || []); // <-- Guardar roles
            } catch (err) {
                 console.error("Error fetching initial data:", err);
                 setError("No se pudieron cargar datos necesarios (departamentos o cargos).");
            } finally {
                setLoadingLocation(prev => ({ ...prev, dep: false }));
                setLoadingRoles(false); // Finalizar carga roles
            }
        };
        fetchData();
     }, []); // Cargar solo una vez

   useEffect(() => { // Fetch Provincias
       // --- MODIFICACIÓN: Usar selectedDepartmentCode ---
       if (selectedDepartmentCode && open) {
           const fetchProvinces = async () => {
                setLoadingLocation(prev => ({ ...prev, prov: true }));
                setProvinces([]); setMunicipalities([]); // Limpiar dependientes
                // --- MODIFICACIÓN: Resetear códigos dependientes ---
                setValue('location.provinceCode', '');
                setValue('location.municipalityCode', '');
                // --- FIN MODIFICACIÓN ---
                try {
                   // --- MODIFICACIÓN: Enviar departmentCode ---
                   const response = await api.get(`/locations/provinces?departmentCode=${selectedDepartmentCode}`);
                   // --- FIN MODIFICACIÓN ---
                   setProvinces(response.data.data.provinces || []);
                } catch (err) { console.error("Error fetching provinces:", err); setProvinces([]);}
                finally{ setLoadingLocation(prev => ({ ...prev, prov: false }));}
           };
           fetchProvinces();
       } else if (open) {
         setProvinces([]); setMunicipalities([]);
         // --- MODIFICACIÓN: Resetear códigos ---
         setValue('location.provinceCode', '');
         setValue('location.municipalityCode', '');
         // --- FIN MODIFICACIÓN ---
       }
       // --- MODIFICACIÓN: Depender de selectedDepartmentCode ---
     }, [selectedDepartmentCode, open, setValue]);
       // --- FIN MODIFICACIÓN ---
   
      useEffect(() => { // Fetch Municipios
       // --- MODIFICACIÓN: Usar selectedProvinceCode ---
       if (selectedProvinceCode && open) {
           const fetchMunicipalities = async () => {
                setLoadingLocation(prev => ({ ...prev, mun: true }));
                setMunicipalities([]); // Limpiar dependientes
                // --- MODIFICACIÓN: Resetear código dependiente ---
                setValue('location.municipalityCode', '');
                // --- FIN MODIFICACIÓN ---
                try {
                    // --- MODIFICACIÓN: Enviar provinceCode ---
                   const response = await api.get(`/locations/municipalities?provinceCode=${selectedProvinceCode}`);
                   // --- FIN MODIFICACIÓN ---
                   setMunicipalities(response.data.data.municipalities || []);
                } catch (err) { console.error("Error fetching municipalities:", err); setMunicipalities([]); }
                finally{ setLoadingLocation(prev => ({ ...prev, mun: false }));}
           };
           fetchMunicipalities();
       } else if (open) {
         setMunicipalities([]);
         // --- MODIFICACIÓN: Resetear código ---
         setValue('location.municipalityCode', '');
         // --- FIN MODIFICACIÓN ---
       }
       // --- MODIFICACIÓN: Depender de selectedProvinceCode ---
     }, [selectedProvinceCode, open, setValue]);
    // --- Fin Fetch Ubicaciones ---


    // --- Handlers Foto (Revisados y Completos) ---
    const handlePhotoMenuOpen = (event) => { setAnchorElPhotoMenu(event.currentTarget); };
    const handlePhotoMenuClose = () => { setAnchorElPhotoMenu(null); };

    const handleUploadClick = () => {
        handlePhotoMenuClose();
        fileInputRef.current?.click(); // Activa el input file oculto
    };

    const handleFileChange = (event) => {
        // Asegurarse de detener cámara si estaba abierta
        // stopCameraStream();
        // setIsCameraOpen(false);
        const file = event.target.files[0];
        setValue('memberPhoto', file || null, { shouldDirty: true }); // Actualizar RHF
        if (file) {
            // Validar tipo de archivo (opcional pero recomendado)
            if (!file.type.startsWith('image/')) {
                setError('Por favor, selecciona un archivo de imagen válido (JPG, PNG, GIF, etc.).');
                // Limpiar el input file por si acaso
                if (fileInputRef.current) { fileInputRef.current.value = ''; }
                return; // Detener si no es imagen
            }
            setError(''); // Limpiar error si había uno previo

            // Guardar el archivo en React Hook Form
            setValue('memberPhoto', file, { shouldDirty: true }); // <-- Guardar el File object

            // Crear el Data URL para la previsualización
            const reader = new FileReader();

            // Callback cuando la lectura se completa
            reader.onloadend = () => {
                console.log("FileReader onloadend - reader.result:", reader.result ? 'Data URL generado' : 'Sin resultado'); // <-- DEBUG 2: ¿Se genera el Data URL?
                setProfilePicPreview(reader.result); // <-- Actualizar el estado del preview
            };

            // Callback para errores de lectura
            reader.onerror = (error) => {
                 console.error("FileReader Error:", error);
                 setError("Error al leer el archivo de imagen para previsualización.");
                 setProfilePicPreview(null); // Asegurar que no quede un preview viejo
                 setValue('memberPhoto', null, { shouldDirty: true }); // Limpiar también en RHF
                 if (fileInputRef.current) { fileInputRef.current.value = ''; }
            };

            // Iniciar la lectura del archivo como Data URL
            console.log("FileReader: Iniciando readAsDataURL..."); // <-- DEBUG 3
            reader.readAsDataURL(file);

        } else {
            console.log("No se seleccionó archivo o se canceló.");
            setProfilePicPreview(null); // Limpiar preview
            setValue('memberPhoto', null); // Limpiar RHF
        }
    };

    const handleOpenCameraModal = () => {
        handlePhotoMenuClose();
        setProfilePicPreview(null); // Limpiar preview de archivo
        setValue('memberPhoto', null); // Limpiar archivo en RHF
        setCameraModalOpen(true);
    };
    const handleCloseCameraModal = () => { setCameraModalOpen(false); };

    const handlePictureTaken = (pictureFile) => {
        if (pictureFile) {
             setValue('memberPhoto', pictureFile, { shouldDirty: true });
             // Crear URL temporal para preview desde Blob/File
             const previewUrl = URL.createObjectURL(pictureFile);
             setProfilePicPreview(previewUrl);
             // Opcional: Revocar URL anterior si existía para liberar memoria
             // if (profilePicPreview && profilePicPreview.startsWith('blob:')) {
             //    URL.revokeObjectURL(profilePicPreview);
             // }
        }
        setCameraModalOpen(false);
    };

     const handleRemovePicture = () => {
         handlePhotoMenuClose();
         setProfilePicPreview(null);
         setValue('memberPhoto', null, { shouldDirty: true });
         if (fileInputRef.current) { fileInputRef.current.value = ''; } // Limpiar el input file
     };


    // --- onSubmit ---
    const onSubmit = async (data) => {
        setLoading(true); setError(''); setSuccessData(null);
        const formData = new FormData();

        // Añadir todos los campos del formulario
        formData.append('fullName', data.fullName);
        formData.append('idCard', data.idCard);
        formData.append('idCardExtension', data.idCardExtension);
        if (data.birthDate) formData.append('birthDate', data.birthDate.toISOString().split('T')[0]);
        const sexValue = data.sex === 'male' ? true : (data.sex === 'female' ? false : undefined);
        if (sexValue !== undefined) formData.append('sex', sexValue);
        if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
        formData.append('location[departmentCode]', Number(data.location.departmentCode));
        formData.append('location[provinceCode]', Number(data.location.provinceCode));
        formData.append('location[municipalityCode]', Number(data.location.municipalityCode));
        formData.append('location[zone]', data.location.zone);
        formData.append('location[neighborhood]', data.location.neighborhood);
        formData.append('location[street]', data.location.street);
        formData.append('neighborhoodCouncilName', data.neighborhoodCouncilName);
        formData.append('memberRoleInCouncilCode', Number(data.memberRoleInCouncilCode));
        if (data.memberPhoto instanceof File) {
            console.log("Añadiendo memberPhoto al FormData:", data.memberPhoto.name); // DEBUG
            formData.append('memberPhoto', data.memberPhoto); // 'memberPhoto' debe coincidir con upload.single()
        } else {
            console.log("No se encontró archivo en data.memberPhoto"); // DEBUG
        }

        try {
            const response = await api.post('/members/register', formData, {
                 headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Guardar datos para el PDF y mostrar mensaje éxito
            const regData = response.data.data;
            // --- Construir dataForPdf buscando nombres ---
             const dataForPdf = {
                fullName: regData.fullName,
                registrationCode: regData.registrationCode,
                idCard: regData.idCard,
                idCardExtension: data.idCardExtension ? (departments.find(d => d.code == data.idCardExtension)?.abbreviation || data.idCardExtension) : '', // Mostrar abreviatura si se puede
                birthDate: data.birthDate ? data.birthDate.toLocaleDateString('es-ES') : 'No especificado',
                sex: data.sex === 'male' ? 'Masculino' : (data.sex === 'female' ? 'Femenino' : 'No especificado'),
                phoneNumber: data.phoneNumber || 'No especificado',
                departmentName: departments.find(d => d.code == data.location.departmentCode)?.name || '',
                provinceName: provinces.find(p => p.code == data.location.provinceCode)?.name || '',
                municipalityName: municipalities.find(m => m.code == data.location.municipalityCode)?.name || '',
                zone: data.location.zone  || data.location.zone, // Usar el dato guardado o el del form,
                neighborhood: data.location.neighborhood  || data.location.neighborhood,
                street: data.location.street || data.location.street,
                neighborhoodCouncilName: data.neighborhoodCouncilName || data.neighborhoodCouncilName,
                memberRoleInCouncilName: councilRoles.find(r => r.code == data.memberRoleInCouncilCode)?.name || `Código ${regData.memberRoleInCouncilCode}`,
                registrationDate: new Date().toLocaleString('es-ES'),
                photoDataUrl: profilePicPreview // Guardar la URL de la preview

            };
            setSuccessData(dataForPdf);
            reset(); // Limpiar formulario
            setProfilePicPreview(null); // Limpiar preview
            window.scrollTo(0, 0); // Scroll hacia arriba para ver mensaje

        } catch (err) { setError(err.response?.data?.message || 'Error al enviar el registro.'); console.error(err); }
        finally { setLoading(false); }
    };

     // --- Función para Generar PDF (similar a la anterior) ---
     const generatePdf = () => {
        if (!successData) return;
        const doc = new jsPDF();
        const margin = 15;
        const lineHeight = 7;
        const photoTopMargin = 25;
        const textStartY = photoTopMargin + 55; // Empezar texto debajo de la foto + margen
        let currentY = margin;
        const photoSize = 40; // Tamaño de la foto en el PDF (mm)
        const addLine = (label, value) => {
            doc.setFont(undefined, 'bold');
            doc.text(`${label}:`, margin, currentY);
            doc.setFont(undefined, 'normal');
            // Usar splitTextToSize para manejar texto largo y text() con maxwidth
            const valueText = String(value || 'No especificado');
            const splitText = doc.splitTextToSize(valueText, textMaxWidth - 35); // 35 = margen + ancho aprox etiqueta
            doc.text(splitText, margin + 40, currentY);
            currentY += (splitText.length * lineHeight * 0.7) + (lineHeight * 0.3) ; // Incrementar Y basado en número de líneas
            if (currentY > 270) { doc.addPage(); currentY = margin; }
        };
        doc.text('Comprobante de Registro de Miembro - CONALJUVE', 15, 15);
        // --- Añadir Foto (si existe) ---
        if (successData.photoDataUrl) {
            try {
                // Posicionar foto a la derecha
                const photoX = doc.internal.pageSize.getWidth() - margin - photoSize;
                // addImage(imageData, format, x, y, width, height)
                doc.addImage(successData.photoDataUrl, 'JPEG', photoX, photoTopMargin, photoSize, photoSize); // Asume JPEG/PNG, ajusta formato si es necesario
                 // Añadir un borde simple alrededor de la foto (opcional)
                 // doc.rect(photoX, photoTopMargin, photoSize, photoSize);
            } catch (e) {
                console.error("Error añadiendo imagen al PDF:", e);
                // Opcional: añadir texto indicando error de imagen
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text("Error al cargar foto", doc.internal.pageSize.getWidth() - margin - photoSize, photoTopMargin + photoSize / 2);
                doc.setTextColor(0); // Resetear color
            }
        }
        // --- Fin Añadir Foto ---
        // --- Información del Usuario (A la izquierda de la foto) ---
        const textMaxWidth = doc.internal.pageSize.getWidth() - margin * 2 - photoSize - 5; // Ancho máximo para texto

        doc.setFontSize(12); doc.setFont(undefined, 'bold');
        
        doc.setFont(undefined, 'normal');

        currentY += lineHeight; // Espacio extra
        addLine('Código Registro', successData.registrationCode, margin,lineHeight);
        
        addLine('Nombre Completo', successData.fullName);
        addLine('CI', `${successData.idCard || ''} ${successData.idCardExtension || ''}`);
        addLine('Fecha de Nacimiento', successData.birthDate);
        addLine('Género', successData.sex);
        addLine('Carnet de Identidad', successData.idCard);
        addLine('Número de Celular', successData.phoneNumber);
        currentY += lineHeight * 0.5; // Espacio extra
        doc.setFont(undefined, 'bold'); doc.text('Ubicación Registrada:', margin, currentY);
        currentY += lineHeight; doc.setFont(undefined, 'normal');
        addLine('Departamento', successData.departmentName);
        addLine('Provincia', successData.provinceName);
        addLine('Municipio', successData.municipalityName);
        addLine('Zona', successData.zone);
        addLine('Barrio', successData.neighborhood);
        addLine('Calle', successData.street);
        currentY += lineHeight * 0.5; // Espacio extra
        doc.setFont(undefined, 'bold'); doc.text('Información de Junta:', margin, currentY);
        currentY += lineHeight; doc.setFont(undefined, 'normal');
        addLine('Junta Vecinal', successData.neighborhoodCouncilName); 
        addLine('Cargo en Junta', successData.memberRoleInCouncilName);
        currentY += lineHeight; // Espacio extra
        // ... (lógica para añadir título, datos de successData con addLine) ...
         doc.setFontSize(10);
         doc.setTextColor(100);
         doc.text(`Fecha de Solicitud: ${successData.registrationDate}`, 15, doc.internal.pageSize.height - 20);
         doc.text('IMPORTANTE: Este es un comprobante de recepción. Su registro está PENDIENTE DE VERIFICACIÓN.', 15, doc.internal.pageSize.height - 12);
        doc.save(`comprobante_registro_conaljuve_${successData.registrationCode}.pdf`);
    };
    // --- Fin Generar PDF ---
    // Variable para imagen a mostrar (solo preview aquí)
    const displayImageUrl = profilePicPreview || undefined;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <Container maxWidth="md" sx={{ py: 4 }}> {/* Contenedor más centrado */}
             <Typography variant="h1" component="h1" gutterBottom align="center">
                 Registro de Miembros CONALJUVE
             </Typography>
             <Typography align='center' paragraph sx={{ mb: 4 }}>
             COMPLETA EL FORMULARIO Y REGÍSTRATE COMO MIEMBRO AFILIADO OFICIAL DE LA CONALJUVE - BOLIVIA.
             </Typography>

             {/* Formulario principal */}
             <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                  {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                  {/* Mensaje de Éxito y PDF */}
                  {successData && (
                     <Alert
                         severity="success"
                         action={
                             <Button color="inherit" size="small" onClick={generatePdf}>
                                 Descargar Comprobante PDF
                             </Button>
                         }
                         sx={{ mb: 3 }}
                     >
                         ¡Registro recibido exitosamente! Su código es: <strong>{successData.registrationCode}</strong>.
                         <br/>Su solicitud será verificada por CONALJUVE.
                         <Button onClick={() => navigate('/')} size="small" sx={{ml: 2, display: 'block', mt: 1}}>Volver al Inicio</Button>
                     </Alert>
                  )}

                 {/* Ocultar formulario si hubo éxito */}
                 {!successData && (
                     <Grid container spacing={3}>
                         {/* --- Datos Personales --- */}
                         <Grid item xs={12}>
                             <Paper sx={{ p: 2.5 }} variant="outlined">
                                  <Typography variant="h6" gutterBottom>Datos Personales</Typography>
                                  <Grid container spacing={2}>
                                       <Grid item xs={12}><TextField fullWidth size="small" label="Nombre Completo*" {...register("fullName", { required: true })} error={!!errors.fullName} helperText={errors.fullName?.message} disabled={loading} slotProps={{ inputLabel: { shrink: true }}}/> </Grid>
                                       <Grid item xs={12} sm={7}><TextField fullWidth size="small" label="Carnet Identidad*" {...register("idCard", { required: true })} error={!!errors.idCard} helperText={errors.idCard?.message} disabled={loading} slotProps={{ inputLabel: { shrink: true }}}/> </Grid>
                                       <Grid item xs={12} sm={5} style={{ width: '10%' }}><FormControl required fullWidth size="small" error={!!errors.idCardExtension} disabled={loading}><InputLabel shrink={true}>Extendido</InputLabel><Controller name="idCardExtension" rules={{ required: true}} control={control} render={({ field }) => ( <Select label="Extensión*" {...field}> <MenuItem value=""><em>--</em></MenuItem> {departments.map((dept) => ( <MenuItem key={dept.code} value={dept.code}>{dept.abbreviation || dept.code}</MenuItem> ))} </Select> )}/></FormControl> </Grid>
                                       <Grid item xs={12} sm={6}><Controller name="birthDate" control={control} render={({ field }) => (<DatePicker slotProps={{ textField: { fullWidth: true, size: 'small', error: !!errors.birthDate, helperText: errors.birthDate?.message, InputLabelProps: { shrink: true }}}} label="Fecha de Nacimiento" {...field} value={field.value || null} disabled={loading} disableFuture/> )}/> </Grid>
                                       <Grid item xs={12} sm={6} style={{ width: '10%' }}><FormControl fullWidth size="small" error={!!errors.sex} disabled={loading}><InputLabel shrink={true}>Sexo</InputLabel><Controller name="sex" control={control} render={({ field }) => (<Select label="Sexo" {...field}><MenuItem value=""><em>(Opcional)</em></MenuItem><MenuItem value="male">Masculino</MenuItem><MenuItem value="female">Femenino</MenuItem></Select>)} /></FormControl> </Grid>
                                       <Grid item xs={12}><TextField fullWidth size="small" label="Número Celular**" {...register("phoneNumber")} error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message} disabled={loading} slotProps={{ inputLabel: { shrink: true }}}/> </Grid>
                                   </Grid>
                             </Paper>
                         </Grid>
                               {/* --- SECCIÓN FOTO REVISADA --- */}
                              <Box sx={{ mb: 2.5 }}> {/* Contenedor para Foto */}
                                 <Typography variant="body2" color="textSecondary" gutterBottom>Foto del Miembro (Opcional)</Typography>
                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <Tooltip title="Añadir/Cambiar foto">
                                          {/* IconButton envuelve Avatar para el menú */}
                                          <IconButton onClick={handlePhotoMenuOpen} sx={{ p: 0 }} disabled={loading}>
                                              <Avatar src={displayImageUrl} sx={{ width: 80, height: 80, bgcolor: 'grey.300' }}>
                                                  {!displayImageUrl && <PersonIcon sx={{ fontSize: 40 }}/>}
                                              </Avatar>
                                          </IconButton>
                                      </Tooltip>

                                      {/* Input file oculto, activado por el menú */}
                                      <input
                                          type="file"
                                          accept="image/*"
                                          onChange={handleFileChange}
                                          id="member-photo-upload-input" // ID único
                                          style={{ display: 'none' }}
                                          ref={fileInputRef}
                                          // Quitar {...register} si confías en setValue
                                       />

                                      {/* Texto si no hay imagen seleccionada */}
                                      {!displayImageUrl && !isCameraOpen && (
                                          <Typography variant='body2' color='text.secondary'>
                                              Haz clic en la imagen para subir o tomar una foto.
                                          </Typography>
                                      )}

                                       {/* Mostrar nombre de archivo si se subió y no hay preview (fallback) */}
                                       {watch('memberPhoto') && !profilePicPreview && !isCameraOpen && (
                                           <Typography variant="caption" sx={{ ml: 1, fontStyle: 'italic' }}>
                                               {watch('memberPhoto').name}
                                           </Typography>
                                        )}

                                      {/* Mostrar error de validación de RHF si lo tienes */}
                                       {errors.memberPhoto && <FormHelperText error>{errors.memberPhoto.message}</FormHelperText>}

                                      {/* Menú de Opciones */}
                                      <Menu
                                          id="photo-menu"
                                          anchorEl={anchorElPhotoMenu}
                                          open={Boolean(anchorElPhotoMenu)}
                                          onClose={handlePhotoMenuClose}
                                          /* ... anchorOrigin/transformOrigin ... */
                                      >
                                           {/* Este MenuItem ahora activa el input oculto */}
                                          <MenuItem onClick={handleUploadClick}>
                                              <UploadFileIcon fontSize="small" sx={{ mr: 1 }} /> Subir Archivo
                                          </MenuItem>
                                          <MenuItem onClick={handleOpenCameraModal}>
                                              <CameraAltIcon fontSize="small" sx={{ mr: 1 }} /> Usar Cámara
                                          </MenuItem>
                                          {/* Mostrar Quitar Foto SOLO si hay un preview actual */}
                                          {displayImageUrl && <Divider />}
                                          {displayImageUrl &&
                                              <MenuItem onClick={handleRemovePicture} sx={{color: 'error.main'}}>
                                                 <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Quitar Foto
                                              </MenuItem>
                                           }
                                      </Menu>
                                  </Box>
                              </Box>
                             {/* --- FIN SECCIÓN FOTO --- */}
                             <Divider sx={{ my: 2 }}/>
                          
                          {/* --- Datos Junta Vecinal y Ubicación --- */}
                         <Grid item xs={12}>
                              <Paper sx={{ p: 2.5 }} variant="outlined">
                                  <Typography variant="h6" gutterBottom>Información de Junta Vecinal y Ubicación</Typography>
                                  <Grid container spacing={2}>
                                       <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Nombre Junta Vecinal u OTB*" {...register("neighborhoodCouncilName", { required: true })} error={!!errors.neighborhoodCouncilName} helperText={errors.neighborhoodCouncilName?.message} disabled={loading} slotProps={{ inputLabel: { shrink: true } }}/></Grid>
                                       <Grid item xs={12} sm={6} style={{ width: '15%' }}>
                                                <FormControl required fullWidth size="small" error={!!errors.memberRoleInCouncilCode} disabled={loading || loadingRoles}>
                                                    <InputLabel shrink={true} id="council-role-label">Cargo*</InputLabel>
                                                    <Controller
                                                        name="memberRoleInCouncilCode" // <-- Usar Code
                                                        control={control}
                                                        rules={{ required: 'Seleccione un cargo' }}
                                                        render={({ field }) => (
                                                            <Select
                                                                labelId="council-role-label"
                                                                label="Cargo en la Junta*"
                                                                {...field} // field.value será el NÚMERO
                                                            >
                                                                <MenuItem value="">
                                                                    <em>{loadingRoles ? 'Cargando...' : 'Seleccione...'}</em>
                                                                </MenuItem>
                                                                {/* Mapear councilRoles */}
                                                                {councilRoles.map((role) => (
                                                                    // value es role.code, texto es role.name
                                                                    <MenuItem key={role.code} value={role.code}>
                                                                        {role.name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                    {errors.memberRoleInCouncilCode && <FormHelperText error>{errors.memberRoleInCouncilCode.message}</FormHelperText>}
                                                </FormControl>
                                           </Grid>
                                       <Divider/>
                                       <Divider/>
                                       <Grid item xs={12} sm={6}  style={{ width: '15%' }}><FormControl required fullWidth size="small" error={!!errors.location?.departmentCode} disabled={loadingLocation.dep || loading}><InputLabel shrink={true}>Departamento*</InputLabel><Controller name="location.departmentCode" rules={{ required: true}} control={control} render={({ field }) => ( <Select label="Departamento*" {...field} ><MenuItem value=""><em>Seleccione...</em></MenuItem>{departments.map(d => <MenuItem key={d.code} value={d.code}>{d.name}</MenuItem>)}</Select> )}/></FormControl> </Grid>
                                       <Grid item xs={12} sm={6}  style={{ width: '15%' }}><FormControl required fullWidth size="small" error={!!errors.location?.provinceCode} disabled={!selectedDepartmentCode || loadingLocation.prov || loading}><InputLabel shrink={true}>Provincia*</InputLabel><Controller name="location.provinceCode" rules={{ required: true}} control={control} render={({ field }) => ( <Select label="Provincia*" {...field} ><MenuItem value=""><em>Seleccione...</em></MenuItem>{provinces.map(p => <MenuItem key={p.code} value={p.code}>{p.name}</MenuItem>)}</Select> )}/></FormControl> </Grid>
                                       <Grid item xs={12} sm={6}  style={{ width: '15%' }}><FormControl required fullWidth size="small" error={!!errors.location?.municipalityCode} disabled={!selectedProvinceCode || loadingLocation.mun || loading}><InputLabel shrink={true}>Municipio*</InputLabel><Controller name="location.municipalityCode" rules={{ required: true}} control={control} render={({ field }) => ( <Select label="Municipio*" {...field} ><MenuItem value=""><em>Seleccione...</em></MenuItem>{municipalities.map(m => <MenuItem key={m.code} value={m.code}>{m.name}</MenuItem>)}</Select> )}/></FormControl> </Grid>
                                       <Grid item xs={12} sm={6} ><TextField required fullWidth label="Zona*" size="small" {...register("location.zone", { required: true })} error={!!errors.location?.zone} helperText={errors.location?.zone?.message} disabled={loading} slotProps={{ inputLabel: { shrink: true } }}/></Grid>
                                       <Grid item xs={12} sm={6} ><TextField required fullWidth label="Barrio*" size="small" {...register("location.neighborhood", { required: true })} error={!!errors.location?.neighborhood} helperText={errors.location?.neighborhood?.message} disabled={loading} slotProps={{ inputLabel: { shrink: true } }}/></Grid>
                                       <Grid item xs={12} sm={6} ><TextField required fullWidth label="Calle(s) /Nro*" size="small" {...register("location.street", { required: true })} error={!!errors.location?.street} helperText={errors.location?.street?.message} disabled={loading} slotProps={{ inputLabel: { shrink: true } }}/></Grid>
                                   </Grid>
                              </Paper>
                         </Grid>

                         {/* Botón Submit */}
                         <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                                  {loading ? <CircularProgress size={24} color="inherit"/> : 'Enviar Registro'}
                              </Button>
                         </Grid>

                     </Grid>
                 )}
             </form>
        </Container>
        <CameraModal
                  open={cameraModalOpen}
                  onClose={handleCloseCameraModal}
                  onPictureTaken={handlePictureTaken}
             />
        </LocalizationProvider>
    );
};

export default MemberRegistrationPage;