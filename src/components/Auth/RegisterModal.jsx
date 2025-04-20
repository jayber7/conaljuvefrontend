// src/components/Auth/RegisterModal.jsx
import React, { useState, useEffect, useRef, useCallback  } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Box, CircularProgress, Alert, Grid, Select, MenuItem, InputLabel, FormControl,
  Input, Avatar, Typography, Paper, Link, FormHelperText // Importar FormHelperText para errores de Select
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera'; // Icono para subir foto
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'; // Adapter para DatePicker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
//import es from 'date-fns/locale/es'; // Locale español para DatePicker
import { es } from 'date-fns/locale';
import CameraAltIcon from '@mui/icons-material/CameraAlt'; // Icono para activar cámara
import CloseIcon from '@mui/icons-material/Close'; // Icono para cerrar cámara
import SwitchCameraIcon from '@mui/icons-material/SwitchCamera'; // Icono para cambiar cámara (avanzado)
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Para tablas en PDF (opcional)

const RegisterModal = ({ open, onClose, onSwitchToLogin }) => {
  const { register: authRegister } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState({ dep: false, prov: false, mun: false, suggestion: false });
  const [profilePicPreview, setProfilePicPreview] = useState(null); // Estado para previsualización
  const fileInputRef = useRef(null); // Ref para el input file oculto
// --- ESTADOS PARA LA CÁMARA ---
const [isCameraOpen, setIsCameraOpen] = useState(false);
const [cameraError, setCameraError] = useState('');
const [cameraStream, setCameraStream] = useState(null);
const videoRef = useRef(null); // Ref para el elemento <video>
const canvasRef = useRef(null); // Ref para el <canvas> oculto
// --- FIN ESTADOS CÁMARA ---
const [pdfData, setPdfData] = useState(null); // Estado para guardar datos del PDF
  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
      defaultValues: {
          name: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          location: { departmentCode: '', provinceCode: '', municipalityCode: '', zone: '' },
          birthDate: null, // Usar null para DatePicker
          gender: '', // Usar '' para Select y manejar opción 'Seleccionar'
          //profilePictureUrl: '', // Opcional
          idCard: '',
          idCardExtension: '',
          phoneNumber: '',        
      }
  });
  // --- Lógica de Cámara ---

    // Función para detener el stream actual
    const stopCameraStream = useCallback(() => {
      if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
          setCameraStream(null);
      }
  }, [cameraStream]);

  // Función para iniciar la cámara
  const startCamera = useCallback(async () => {
      stopCameraStream(); // Detener stream anterior si existe
      setCameraError('');
      setIsCameraOpen(true);
      setProfilePicPreview(null); // Limpiar previsualización de archivo si la había
      setValue('profilePicture', null); // Limpiar archivo seleccionado

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
              // Pedir cámara trasera en móviles si es posible (opcional)
              const constraints = {
                  video: {
                      facingMode: "user" // 'user' para selfie, 'environment' para trasera
                      // width: { ideal: 640 }, // Puedes definir resolución ideal
                      // height: { ideal: 480 }
                   }
              };
              const stream = await navigator.mediaDevices.getUserMedia(constraints);
              setCameraStream(stream);
              if (videoRef.current) {
                  videoRef.current.srcObject = stream;
              }
          } catch (err) {
              console.error("Error accessing camera:", err);
              setCameraError(`No se pudo acceder a la cámara: ${err.name} - ${err.message}`);
              setIsCameraOpen(false);
          }
      } else {
          setCameraError("Tu navegador no soporta el acceso a la cámara.");
          setIsCameraOpen(false);
      }
  }, [stopCameraStream, setValue]);

  // Función para capturar la foto
  const takePicture = () => {
      if (!videoRef.current || !canvasRef.current || !cameraStream) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Ajustar tamaño del canvas al del video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Dibujar el frame actual del video en el canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convertir canvas a Blob (mejor que Data URL para enviar)
      canvas.toBlob(async (blob) => {
          if (blob) {
              // Crear un objeto File a partir del Blob para react-hook-form
              const fileName = `conaljuve_pic_${Date.now()}.png`;
              const pictureFile = new File([blob], fileName, { type: 'image/png' });

              setValue('profilePicture', pictureFile, { shouldValidate: true }); // Guardar archivo en el form

              // Mostrar previsualización desde el Blob
              setProfilePicPreview(URL.createObjectURL(blob));

              // Detener la cámara después de tomar la foto
              stopCameraStream();
              setIsCameraOpen(false);
          } else {
               console.error("Error al crear Blob desde canvas");
               setCameraError("No se pudo capturar la imagen.");
          }
      }, 'image/png', 0.9); // Formato PNG, calidad 0.9
  };

  // Limpiar stream al cerrar modal o desmontar
   useEffect(() => {
      // Limpiar cuando el modal se cierra o el componente se desmonta
      return () => {
          stopCameraStream();
      };
  }, [stopCameraStream, open]); // Asegurarse de detener si 'open' cambia a false

  // --- Fin Lógica Cámara ---
  // --- Manejo de Selección de Archivo ---
    const handleFileChange = (event) => {
        stopCameraStream(); // Detener cámara si estaba abierta
        setIsCameraOpen(false);
        const file = event.target.files[0];
        if (file) {
            // Previsualización (opcional)
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log("FileReader onloadend:", reader.result ? 'Data URL generado' : 'Sin resultado'); // DEBUG
                setProfilePicPreview(reader.result); // <-- Actualiza la previsualización
            };
            reader.onerror = (error) => { // DEBUG
                console.error("FileReader Error:", error);
                setError("Error al leer el archivo de imagen.");
                setProfilePicPreview(null);
           };
            reader.readAsDataURL(file);
            
            // Guardar el archivo en el estado del formulario (o manejarlo al submit)
            // register('profilePicture').onChange(event); // O usar setValue
            setValue('profilePicture', file); // <-- Guarda el archivo en RHF
        } else {
            setProfilePicPreview(null);
            setValue('profilePicture', null);
        }
    };
    // --- Fin Manejo de Archivo --
  // --- MODIFICACIÓN: Observar los códigos ---
  const selectedDepartmentCode = watch('location.departmentCode');
  const selectedProvinceCode = watch('location.provinceCode');
  // --- FIN MODIFICACIÓN ---

  // --- Fetch Ubicaciones ---
  useEffect(() => { // Fetch Departamentos
    if (open) {
        const fetchDepartments = async () => {
            setLoadingLocation(prev => ({ ...prev, dep: true }));
            try {
                const response = await api.get('/locations/departments');
                setDepartments(response.data.data.departments || []);
            } catch (err) { console.error("Error fetching departments:", err); }
            finally { setLoadingLocation(prev => ({ ...prev, dep: false }));}
        };
        fetchDepartments();
        setSuccess(false);
        setError('');
        // Resetear formulario con valores por defecto (que ahora usan ...Code)
        reset({
           name: '', username: '', email: '', password: '', confirmPassword: '',
           location: { departmentCode: '', provinceCode: '', municipalityCode: '', zone: '' }
        });
    } else {
        setDepartments([]); setProvinces([]); setMunicipalities([]); // Limpiar al cerrar
    }
  }, [open, reset]);

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
    // --- FIN MODIFICACIÓN ---
  // --- Fin Fetch Ubicaciones ---


  // --- Sugerencia de Ubicación (Geolocation) ---
  const handleSuggestLocation = () => {
      // ... (lógica interna de geoloc y llamada API sin cambios) ...
      navigator.geolocation.getCurrentPosition(async (position) => {
            // ...
            try {
                const response = await api.get(`/locations/suggestions?lat=${latitude}&lon=${longitude}`);
                const suggestion = response.data.data.suggestion;
                if (suggestion) {
                    // --- MODIFICACIÓN: Usar setValue con los CÓDIGOS ---
                    // Necesitas los códigos en la respuesta de /suggestions
                    // o hacer una búsqueda extra aquí si solo devuelve nombres
                    if (suggestion.departmentCode) {
                         setValue('location.departmentCode', suggestion.departmentCode, { shouldValidate: true });
                    } else {
                        // Intentar buscar por nombre si solo vino el nombre
                        const foundDept = departments.find(d => d.name === suggestion.departmentName);
                        if (foundDept) setValue('location.departmentCode', foundDept.code, { shouldValidate: true });
                    }
                    // Hacer lo mismo para provincia y municipio (puede requerir cargar listas antes)
                    // Esta parte puede volverse compleja si solo tienes nombres
                    if (suggestion.provinceCode) {
                         setValue('location.provinceCode', suggestion.provinceCode, { shouldValidate: true });
                    }
                    if (suggestion.municipalityCode) {
                         setValue('location.municipalityCode', suggestion.municipalityCode, { shouldValidate: true });
                    }
                    setValue('location.zone', suggestion.zone || '', { shouldValidate: true });
                    // --- FIN MODIFICACIÓN ---
                } else { setError("No se pudo obtener sugerencia para tu ubicación."); }
            } catch (err) { setError("Error al obtener sugerencia de ubicación."); console.error(err); }
            finally { setLoadingLocation(prev => ({ ...prev, suggestion: false })); }
          }, /* ... error handler ... */);
  }
   // --- Fin Sugerencia ---


  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) { /* ... (manejo error contraseña) ... */ return; }
    setLoading(true); setError(''); setSuccess(false); setPdfData(null); // Resetear PDF data
    

    const formData = new FormData();
    
    // // --- MODIFICACIÓN: Asegurar que location tenga códigos numéricos ---
    // const { confirmPassword, ...rest } = data;
    // const userData = {
    //     ...rest,
    //     location: {
    //         departmentCode: rest.location.departmentCode ? Number(rest.location.departmentCode) : undefined,
    //         provinceCode: rest.location.provinceCode ? Number(rest.location.provinceCode) : undefined,
    //         municipalityCode: rest.location.municipalityCode ? Number(rest.location.municipalityCode) : undefined,
    //         zone: rest.location.zone || undefined,
    //     },
    //     // --- MODIFICACIÓN: Formatear nuevos campos ---
    //       // DatePicker devuelve objeto Date o null, el backend espera ISO String o Date
    //       birthDate: rest.birthDate ? rest.birthDate.toISOString().split('T')[0] : undefined, // Enviar solo YYYY-MM-DD
    //       // Convertir el valor del Select de género a booleano o undefined
    //       gender: rest.gender === 'male' ? true : (rest.gender === 'female' ? false : undefined),
    //       profilePictureUrl: rest.profilePictureUrl || undefined, // Enviar si no está vacío
    //       idCard: rest.idCard || undefined,
    //       phoneNumber: rest.phoneNumber || undefined,
    //       // --- FIN MODIFICACIÓN ---
    // };
    //  Object.keys(userData).forEach(key => userData[key] === undefined && delete userData[key]);
    //  Object.keys(userData.location).forEach(key => userData.location[key] === undefined && delete userData.location[key]);
    // // --- FIN MODIFICACIÓN ---
    formData.append('name', data.name);
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('password', data.password);
        // No añadir confirmPassword
        if (data.birthDate) formData.append('birthDate', data.birthDate.toISOString().split('T')[0]);
        const genderValue = data.gender === 'male' ? true : (data.gender === 'female' ? false : undefined);
        if (genderValue !== undefined) formData.append('gender', genderValue); // Enviar true/false como string
        if (data.idCard) formData.append('idCard', data.idCard);
        if (data.idCardExtension) formData.append('idCardExtension', data.idCardExtension); // Ya debería estar en mayúsculas por el Select/Input
        if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);

        // Añadir campos de ubicación (asegurarse que son números si no están vacíos)
        if (data.location.departmentCode) formData.append('location[departmentCode]', Number(data.location.departmentCode));
        if (data.location.provinceCode) formData.append('location[provinceCode]', Number(data.location.provinceCode));
        if (data.location.municipalityCode) formData.append('location[municipalityCode]', Number(data.location.municipalityCode));
        if (data.location.zone) formData.append('location[zone]', data.location.zone);

        // Añadir el archivo de imagen SI existe
        if (data.profilePicture) {
            formData.append('profilePicture', data.profilePicture); // 'profilePicture' debe coincidir con upload.single()
        }
        // --- FIN MODIFICACIÓN ---

    try {
      //await authRegister(userData); // Enviar datos formateados
      await api.post('/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // IMPORTANTE para subida de archivos
                },
            });
      setSuccess(true);
      // --- GUARDAR DATOS PARA PDF (SIN la contraseña ni el archivo) ---
      const dataForPdf = {
        name: data.name, username: data.username, email: data.email,
        birthDate: data.birthDate ? data.birthDate.toLocaleDateString('es-ES') : 'No especificada', // Formatear fecha
        gender: data.gender === 'male' ? 'Varón' : (data.gender === 'female' ? 'Mujer' : 'No especificado'),
        idCard: data.idCard || 'No especificado',
        phoneNumber: data.phoneNumber || 'No especificado',
        // Obtener nombres de ubicación (necesitas tenerlos en estado o buscarlos)
        departmentName: departments.find(d => d.code == data.location.departmentCode)?.name || `Código ${data.location.departmentCode || 'N/A'}`,
        provinceName: provinces.find(p => p.code == data.location.provinceCode)?.name || `Código ${data.location.provinceCode || 'N/A'}`,
        municipalityName: municipalities.find(m => m.code == data.location.municipalityCode)?.name || `Código ${data.location.municipalityCode || 'N/A'}`,
        zone: data.location.zone || 'No especificada',
        registrationDate: new Date().toLocaleString('es-ES') // Fecha/hora del registro
    };
   setPdfData(dataForPdf);
   // --- FIN GUARDAR DATOS ---
   reset();
   setProfilePicPreview(null);
   // Quitar cierre automático para permitir descarga de PDF
   // const timer = setTimeout(() => { onClose(); }, 2500);
   // return () => clearTimeout(timer);-
    } catch (err) { setError(err.message || 'Error desconocido al registrarse.'); }
    finally { setLoading(false); }
  };
// --- Función para Generar PDF ---
const generatePdf = () => {
    if (!pdfData) return;

    const doc = new jsPDF();
    const margin = 15;
    const lineHeight = 7;
    let currentY = margin;
    const fullIdCard = pdfData.idCard
            ? `${pdfData.idCard}${pdfData.idCardExtension ? ' ' + pdfData.idCardExtension : ''}`
            : 'No especificado';
        addLine('Carnet de Identidad', fullIdCard); // <-- Mostrar CI con extensión
    // Título
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Comprobante de Registro - CONALJUVE', margin, currentY);
    currentY += lineHeight * 2;

    // Información del Usuario
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Datos del Miembro:', margin, currentY);
    currentY += lineHeight;
    doc.setFont(undefined, 'normal');

    const addLine = (label, value) => {
        doc.setFont(undefined, 'bold');
        doc.text(`${label}:`, margin, currentY);
        doc.setFont(undefined, 'normal');
        // Ajusta el x de inicio del valor para alinear
        doc.text(String(value || 'No especificado'), margin + 45, currentY);
        currentY += lineHeight;
        if (currentY > 270) { // Salto de página si se acerca al final
             doc.addPage();
             currentY = margin;
         }
    };

    addLine('Nombre Completo', pdfData.name);
    addLine('Nombre de Usuario', pdfData.username);
    addLine('Correo Electrónico', pdfData.email);
    addLine('Fecha de Nacimiento', pdfData.birthDate);
    addLine('Género', pdfData.gender);
    addLine('Carnet de Identidad', pdfData.idCard);
    addLine('Número de Celular', pdfData.phoneNumber);

    currentY += lineHeight; // Espacio extra

    doc.setFont(undefined, 'bold');
    doc.text('Ubicación Registrada:', margin, currentY);
    currentY += lineHeight;
    doc.setFont(undefined, 'normal');

    addLine('Departamento', pdfData.departmentName);
    addLine('Provincia', pdfData.provinceName);
    addLine('Municipio', pdfData.municipalityName);
    addLine('Zona/Barrio', pdfData.zone);

    currentY += lineHeight;

    doc.setFontSize(10);
    doc.setTextColor(100); // Gris
    doc.text(`Fecha de Registro: ${pdfData.registrationDate}`, margin, currentY);
    currentY += lineHeight;
    doc.text('Este documento es un comprobante de su registro en el portal CONALJUVE.', margin, currentY);

    // Guardar el PDF
    doc.save(`registro_conaljuve_${pdfData.username}.pdf`);
};
// --- Fin Generar PDF ---
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth> {/* Aumentado a lg */}
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>Crear Cuenta</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <DialogContent sx={{ bgcolor: 'grey.50', p: { xs: 2, sm: 3 } }}>
                {/* Mensaje de Éxito con Botón PDF */}
                {success && (
                    <Alert
                        severity="success"
                        action={
                            pdfData && (
                                <Button color="inherit" size="small" onClick={generatePdf}>
                                    Descargar PDF
                                </Button>
                            )
                        }
                        sx={{ mb: 2 }}
                    >
                        ¡Registro exitoso! Puedes descargar tu comprobante.
                        <Button onClick={onClose} size="small" sx={{ml: 2}}>Cerrar</Button> {/* Botón Cerrar */}
                    </Alert>
                )}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Ocultar formulario si hubo éxito */}
                {!success && (
                    <Grid container spacing={3}> {/* Grid principal */}

                        {/* Columna Izquierda: Datos Personales y Cuenta */}
                        <Grid item xs={12} md={7}>
                            <Paper sx={{ p: 2.5, mb: 3 }} variant="outlined">
                                <Typography variant="h6" gutterBottom>Datos Personales</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Nombre Completo*" {...register("name", { required: true })} error={!!errors.name} helperText={errors.name?.message} disabled={loading}/> </Grid>
                                    <Grid item xs={12} sm={6}><Controller name="birthDate" control={control} render={({ field }) => (<DatePicker slotProps={{ textField: { fullWidth: true, size: 'small', error: !!errors.birthDate, helperText: errors.birthDate?.message } }} label="Fecha Nacimiento" {...field} value={field.value || null} disabled={loading} disableFuture/> )}/> </Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Carnet Identidad" {...register("idCard")} error={!!errors.idCard} helperText={errors.idCard?.message} disabled={loading}/> </Grid>
                                    <Grid item xs={12} sm={6}><FormControl fullWidth size="small" error={!!errors.gender} disabled={loading}><InputLabel>Género</InputLabel><Controller name="gender" control={control} render={({ field }) => (<Select label="Género" {...field}><MenuItem value=""><em>(Opcional)</em></MenuItem><MenuItem value="male">Varón</MenuItem><MenuItem value="female">Mujer</MenuItem></Select>)} /></FormControl> </Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Número Celular" {...register("phoneNumber")} error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message} disabled={loading}/> </Grid>
                                    <Grid item xs={12} sm={7} md={8}> {/* Más espacio para el número */}
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Carnet de Identidad"
                                                    {...register("idCard")}
                                                    error={!!errors.idCard}
                                                    helperText={errors.idCard?.message}
                                                    disabled={loading}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={5} md={4}> {/* Menos espacio para la extensión */}
                                                <FormControl fullWidth size="small" error={!!errors.idCardExtension} disabled={loading}>
                                                    <InputLabel id="idcard-ext-label">Ext.</InputLabel>
                                                    <Controller
                                                        name="idCardExtension"
                                                        control={control}
                                                        // Añade rules si la extensión es obligatoria cuando hay CI
                                                        // rules={{ validate: value => !watch('idCard') || !!value || 'Ext. requerida si hay CI' }}
                                                        render={({ field }) => (
                                                            <Select labelId="idcard-ext-label" label="Ext." {...field}>
                                                                <MenuItem value=""><em>(Opcional)</em></MenuItem>
                                                                {/* Usar la lista de departamentos ya cargada */}
                                                                {departments.map((dept) => (
                                                                    <MenuItem key={dept.code} value={dept.code}>{dept.code}</MenuItem> // Mostrar código corto
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                     {errors.idCardExtension && <FormHelperText>{errors.idCardExtension.message}</FormHelperText>}
                                                </FormControl>
                                            </Grid>
                                </Grid>
                            </Paper>

                            <Paper sx={{ p: 2.5 }} variant="outlined">
                                <Typography variant="h6" gutterBottom>Datos de Cuenta</Typography>
                                 <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Nombre Usuario*" {...register("username", { required: true })} error={!!errors.username} helperText={errors.username?.message} disabled={loading}/> </Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Correo Electrónico*" type="email" {...register("email", { required: true, pattern: /^\S+@\S+$/i })} error={!!errors.email} helperText={errors.email?.message || (errors.email?.type === 'pattern' ? 'Correo inválido' : '')} disabled={loading}/> </Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Contraseña*" type="password" {...register("password", { required: true, minLength: 6 })} error={!!errors.password} helperText={errors.password?.message || (errors.password?.type === 'minLength' ? 'Mínimo 6 caracteres' : '')} disabled={loading}/> </Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Confirmar Contraseña*" type="password" {...register("confirmPassword", { required: true })} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} disabled={loading}/> </Grid>
                                 </Grid>
                            </Paper>
                        </Grid>

                        {/* Columna Derecha: Foto y Ubicación */}
                        <Grid item xs={12} md={5}>
                             <Paper sx={{ p: 2.5, mb: 3 }} variant="outlined">
                                <Typography variant="h6" gutterBottom>Foto de Perfil</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                                    <Avatar src={profilePicPreview || undefined} sx={{ width: 100, height: 100, mb: 1, bgcolor: 'grey.300' }}>
                                        {!profilePicPreview && <PersonIcon sx={{ fontSize: 60 }}/>}
                                    </Avatar>
                                    {/* <input type="file" accept="image/*" onChange={handleFileChange} id="profile-upload-file" style={{ display: 'none' }} ref={fileInputRef} {...register('profilePicture')}/> */}
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileChange} // Solo usar onChange
                                        id="profile-upload-file"
                                        ref={fileInputRef}
                                        // {...register('profilePicture')} // <-- QUITAR ESTA LÍNEA
                                    />
                                    <label htmlFor="profile-upload-file">
                                        <Button variant="outlined" component="span" startIcon={<PhotoCamera />} size="small" disabled={loading || isCameraOpen}>
                                            Subir Archivo
                                        </Button>
                                    </label>
                                    {/* Separador o texto 'o' */}
                                    <Typography variant="caption">o</Typography>
                                    {!isCameraOpen ? (
                                        <Button variant="outlined" startIcon={<CameraAltIcon />} onClick={startCamera} disabled={loading} size="small">Usar Cámara</Button>
                                    ) : (
                                         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                             <Box sx={{ width: '100%', maxWidth: 200, aspectRatio: '1/1', bgcolor: 'black', borderRadius: 1, overflow: 'hidden', position: 'relative'}}>
                                                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                                                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                                            </Box>
                                            {cameraError && <Alert severity="error" size="small" sx={{width: '100%', mt: 1}}>{cameraError}</Alert>}
                                            <Button variant="contained" onClick={takePicture} disabled={loading || !cameraStream} size="small">Tomar Foto</Button>
                                            <Button variant="outlined" color="error" onClick={() => { stopCameraStream(); setIsCameraOpen(false); setCameraError(''); }} disabled={loading} size="small" startIcon={<CloseIcon />}>Cancelar Cámara</Button>
                                         </Box>
                                    )}
                                     {errors.profilePicture && <Typography color="error" variant="caption">{errors.profilePicture.message}</Typography>}
                                </Box>
                             </Paper>

                            <Paper sx={{ p: 2.5 }} variant="outlined">
                                <Typography variant="h6" gutterBottom>Ubicación</Typography>
                                <Grid container spacing={2}>
                                     <Grid item xs={12}><Button variant="outlined" size="small" startIcon={<LocationOnIcon />} onClick={handleSuggestLocation} disabled={loadingLocation.suggestion || loading}>Sugerir Ubicación</Button></Grid>
                                     <Grid item xs={12} sm={6}><FormControl /* ... */ size="small" error={!!errors.location?.departmentCode} disabled={loadingLocation.dep || loading}><InputLabel>Departamento*</InputLabel><Controller name="location.departmentCode" control={control} rules={{ required: true }} render={({ field }) => ( <Select /* ... */ {...field} ><MenuItem value=""><em>Seleccione...</em></MenuItem>{departments.map(d => <MenuItem key={d.code} value={d.code}>{d.name}</MenuItem>)}</Select> )}/></FormControl> </Grid>
                                     <Grid item xs={12} sm={6}><FormControl /* ... */ size="small" error={!!errors.location?.provinceCode} disabled={!selectedDepartmentCode || loadingLocation.prov || loading}><InputLabel>Provincia</InputLabel><Controller name="location.provinceCode" control={control} render={({ field }) => ( <Select /* ... */ {...field} ><MenuItem value=""><em>(Opcional)</em></MenuItem>{provinces.map(p => <MenuItem key={p.code} value={p.code}>{p.name}</MenuItem>)}</Select> )}/></FormControl> </Grid>
                                     <Grid item xs={12} sm={6}><FormControl /* ... */ size="small" error={!!errors.location?.municipalityCode} disabled={!selectedProvinceCode || loadingLocation.mun || loading}><InputLabel>Municipio</InputLabel><Controller name="location.municipalityCode" control={control} render={({ field }) => ( <Select /* ... */ {...field} ><MenuItem value=""><em>(Opcional)</em></MenuItem>{municipalities.map(m => <MenuItem key={m.code} value={m.code}>{m.name}</MenuItem>)}</Select> )}/></FormControl> </Grid>
                                     <Grid item xs={12} sm={6}><TextField fullWidth label="Zona / Barrio" size="small" {...register("location.zone")} disabled={loading} /></Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
                {!success && <Typography /* Link Inicia sesión */ />}
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px', borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                 {/* Mostrar Cancelar solo si no hubo éxito */}
                 {!success && <Button onClick={onClose} disabled={loading} color="inherit">Cancelar</Button>}
                 {/* Mostrar Crear Cuenta solo si no hubo éxito */}
                 {!success && <Button type="submit" variant="contained" color="primary" disabled={loading}> {loading ? <CircularProgress size={24} color="inherit"/> : 'Crear Cuenta'} </Button>}
                 {/* Mostrar botón Cerrar si hubo éxito */}
                 {success && <Button onClick={onClose} color="primary">Cerrar</Button>}
            </DialogActions>
        </form>
    </Dialog>
</LocalizationProvider>
);
};

export default RegisterModal;