// src/components/Auth/RegisterModal.jsx
import React, { useState, useEffect, useRef, useCallback  } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Box, CircularProgress, Alert, Grid, Select, MenuItem, InputLabel, FormControl,
  Input, Avatar, Typography, Link, FormHelperText // Importar FormHelperText para errores de Select
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
                setProfilePicPreview(reader.result);
            };
            reader.readAsDataURL(file);
            // Guardar el archivo en el estado del formulario (o manejarlo al submit)
            // register('profilePicture').onChange(event); // O usar setValue
            setValue('profilePicture', file); // react-hook-form puede manejar File objects
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
    setLoading(true); setError(''); setSuccess(false);

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
      reset();  // Resetear a defaultValues (que ahora incluyen los nuevos campos vacíos/null)
      // --- AÑADIR CIERRE AUTOMÁTICO ---
            // Esperar unos segundos antes de cerrar el modal
            const timer = setTimeout(() => {
              onClose(); // Llama a la función onClose pasada por props
              // Opcional: Cambiar al modal de login después de cerrar
              // onSwitchToLogin();
          }, 2500); // 2500 milisegundos = 2.5 segundos (ajusta el tiempo)

          // Limpiar el temporizador si el componente se desmonta antes
          return () => clearTimeout(timer);
          // --- FIN AÑADIR CIERRE AUTOMÁTICO ---
    } catch (err) { setError(err.message || 'Error desconocido al registrarse.'); }
    finally { setLoading(false); }
  };

  return (
  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Crear Cuenta</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <DialogContent>
          {/* ... (Alerts y campos name, username, email, password sin cambios) ... */}
           {/* El Alert de éxito se mostrará cuando success sea true */}
           {success && <Alert severity="success" sx={{ mb: 2 }}>¡Registro exitoso! Serás redirigido...</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {!success && (
             <Grid container spacing={2}>
                {/* ... (Grid items para name, username, email, password) ... */}
                <Grid item xs={12} sm={6}> <TextField fullWidth label="Nombre Completo" {...register("name", { required: "Nombre requerido" })} error={!!errors.name} helperText={errors.name?.message} disabled={loading || success}/> </Grid>
                <Grid item xs={12} sm={6}> <TextField fullWidth label="Nombre de Usuario" {...register("username", { required: "Usuario requerido" })} error={!!errors.username} helperText={errors.username?.message} disabled={loading || success}/> </Grid>
                <Grid item xs={12}> <TextField fullWidth label="Correo Electrónico" type="email" {...register("email", { required: "Correo requerido", pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" } })} error={!!errors.email} helperText={errors.email?.message} disabled={loading || success}/> </Grid>
                <Grid item xs={12} sm={6}> <TextField fullWidth label="Contraseña" type="password" {...register("password", { required: "Contraseña requerida", minLength: { value: 6, message: "Mínimo 6 caracteres" } })} error={!!errors.password} helperText={errors.password?.message} disabled={loading || success}/> </Grid>
                <Grid item xs={12} sm={6}> <TextField fullWidth label="Confirmar Contraseña" type="password" {...register("confirmPassword", { required: "Confirma la contraseña" })} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} disabled={loading || success}/> </Grid>
                <Grid item xs={12} sm={6} md={4}>
                                <Controller
                                    name="birthDate"
                                    control={control}
                                    // rules={{ required: 'Fecha de nacimiento requerida' }} // Añade si es obligatorio
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Fecha de Nacimiento"
                                            value={field.value || null} // DatePicker espera null o Date
                                            onChange={(newValue) => field.onChange(newValue)}
                                            disabled={loading}
                                            slotProps={{ textField: { fullWidth: true, error: !!errors.birthDate, helperText: errors.birthDate?.message } }}
                                            disableFuture // No permitir fechas futuras
                                        />
                                    )}
                                />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                                {/* Select para Género */}
                                <FormControl fullWidth error={!!errors.gender} disabled={loading}>
                                    <InputLabel id="gender-label">Género</InputLabel>
                                    <Controller
                                        name="gender"
                                        control={control}
                                        // rules={{ required: 'Seleccione un género' }} // Añade si es obligatorio
                                        render={({ field }) => (
                                            <Select labelId="gender-label" label="Género" {...field}>
                                                <MenuItem value=""><em>(Opcional)</em></MenuItem>
                                                <MenuItem value="male">Varón</MenuItem>
                                                <MenuItem value="female">Mujer</MenuItem>
                                                {/* Podrías añadir 'other' si es necesario */}
                                            </Select>
                                        )}
                                    />
                                     {errors.gender && <FormHelperText>{errors.gender.message}</FormHelperText>}
                                </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}><TextField fullWidth label="Carnet de Identidad" {...register("idCard")} error={!!errors.idCard} helperText={errors.idCard?.message} disabled={loading}/></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Número de Celular" {...register("phoneNumber")} error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message} disabled={loading}/></Grid>
                     {/* --- CAMPO FOTO ACTUALIZADO --- */}
                     <Grid item xs={12}> <Typography variant="subtitle2" sx={{mb: 1}}>Foto de Perfil (Opcional)</Typography></Grid>
                                <Grid item xs={12} md={6}>
                                    {/* Área para cámara o previsualización */}
                                    <Box sx={{
                                        width: '100%',
                                        aspectRatio: '1 / 1', // Hacerlo cuadrado
                                        // height: 250, // O altura fija
                                        bgcolor: 'grey.200',
                                        borderRadius: 1,
                                        position: 'relative',
                                        overflow: 'hidden', // Ocultar partes del video que no caben
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        border: '1px solid',
                                        borderColor: 'divider'
                                     }}>
                                        {isCameraOpen ? (
                                            <>
                                                <video
                                                    ref={videoRef}
                                                    autoPlay
                                                    playsInline // Importante para móviles
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover', // Cubrir el área
                                                        transform: 'scaleX(-1)' // Espejar para modo selfie
                                                    }}
                                                    />
                                                {/* Canvas oculto para captura */}
                                                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                                            </>
                                        ) : profilePicPreview ? (
                                            <img src={profilePicPreview} alt="Previsualización" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <PersonIcon sx={{ fontSize: 80, color: 'grey.400' }}/>
                                        )}
                                         {cameraError && <Alert severity="error" sx={{position: 'absolute', bottom: 0, left: 0, right: 0, m: 1, zIndex: 1}}>{cameraError}</Alert>}
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    {/* Controles de Foto */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%', justifyContent: 'center' }}>
                                         <Button
                                            variant="outlined"
                                            component="label"
                                            startIcon={<PhotoCamera />}
                                            disabled={loading || isCameraOpen} // Deshabilitar si la cámara está abierta
                                        >
                                            Subir Archivo
                                            <input type="file" hidden accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                                        </Button>
                                        {!isCameraOpen ? (
                                            <Button
                                                variant="outlined"
                                                startIcon={<CameraAltIcon />}
                                                onClick={startCamera}
                                                disabled={loading}
                                            >
                                                Usar Cámara
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={takePicture}
                                                    disabled={loading || !cameraStream} // Deshabilitar si no hay stream
                                                >
                                                    Tomar Foto
                                                </Button>
                                                 {/* Botón opcional para cambiar cámara (requiere lógica más compleja) */}
                                                 {/* <IconButton size="small"><SwitchCameraIcon /></IconButton> */}
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<CloseIcon />}
                                                    onClick={() => { stopCameraStream(); setIsCameraOpen(false); setCameraError(''); }}
                                                    disabled={loading}
                                                    size="small"
                                                >
                                                    Cerrar Cámara
                                                </Button>
                                            </>
                                        )}
                                         {errors.profilePicture && <Typography color="error" variant="caption">{errors.profilePicture.message}</Typography>}
                                    </Box>
                                </Grid>
                                {/* --- FIN CAMPO FOTO --- */}

            {/* --- Sección Ubicación (Usando Códigos) --- */}
            <Grid item xs={12}> <Typography variant="subtitle1" sx={{mt: 1}}>Ubicación</Typography></Grid>

            <Grid item xs={12} sm={6} md={4}>
                 {/* --- MODIFICACIÓN: Usar location.departmentCode --- */}
                <FormControl fullWidth error={!!errors.location?.departmentCode}>
                   <InputLabel id="department-label">Departamento*</InputLabel>
                   <Controller
                       name="location.departmentCode" // <-- Cambiado
                       control={control}
                       rules={{ required: 'Departamento es requerido' }}
                       render={({ field }) => (
                           <Select labelId="department-label" label="Departamento*" {...field} disabled={loading || loadingLocation.dep || success}>
                               <MenuItem value=""><em>Seleccione...</em></MenuItem>
                               {/* --- MODIFICACIÓN: Usar dep.code como value --- */}
                               {departments.map((dep) => (
                                   <MenuItem key={dep.code} value={dep.code}>{dep.name}</MenuItem>
                               ))}
                               {/* --- FIN MODIFICACIÓN --- */}
                           </Select>
                       )}
                   />
                   {/* --- MODIFICACIÓN: Mostrar error de departmentCode --- */}
                   {errors.location?.departmentCode && <FormHelperText>{errors.location.departmentCode.message}</FormHelperText>}
                   {/* --- FIN MODIFICACIÓN --- */}
                </FormControl>
            </Grid>
             <Grid item xs={12} sm={6} md={4}>
                 {/* --- MODIFICACIÓN: Usar location.provinceCode --- */}
                <FormControl fullWidth error={!!errors.location?.provinceCode} disabled={!selectedDepartmentCode || loadingLocation.prov || loading || success}>
                   <InputLabel id="province-label">Provincia</InputLabel>
                    <Controller
                       name="location.provinceCode" // <-- Cambiado
                       control={control}
                       render={({ field }) => (
                           <Select labelId="province-label" label="Provincia" {...field}>
                               <MenuItem value=""><em>{loadingLocation.prov ? 'Cargando...' : '(Opcional)'}</em></MenuItem>
                                {/* --- MODIFICACIÓN: Usar prov.code como value --- */}
                                {provinces.map((prov) => (
                                   <MenuItem key={prov.code} value={prov.code}>{prov.name}</MenuItem>
                               ))}
                                {/* --- FIN MODIFICACIÓN --- */}
                           </Select>
                       )}
                   />
                   {/* Mostrar error si añades validación opcional */}
                   {errors.location?.provinceCode && <FormHelperText>{errors.location.provinceCode.message}</FormHelperText>}
                </FormControl>
            </Grid>
             <Grid item xs={12} sm={6} md={4}>
                  {/* --- MODIFICACIÓN: Usar location.municipalityCode --- */}
                 <FormControl fullWidth error={!!errors.location?.municipalityCode} disabled={!selectedProvinceCode || loadingLocation.mun || loading || success}>
                   <InputLabel id="municipality-label">Municipio</InputLabel>
                    <Controller
                       name="location.municipalityCode" // <-- Cambiado
                       control={control}
                       render={({ field }) => (
                           <Select labelId="municipality-label" label="Municipio" {...field}>
                               <MenuItem value=""><em>{loadingLocation.mun ? 'Cargando...' : '(Opcional)'}</em></MenuItem>
                               {/* --- MODIFICACIÓN: Usar mun.code como value --- */}
                               {municipalities.map((mun) => (
                                   <MenuItem key={mun.code} value={mun.code}>{mun.name}</MenuItem>
                               ))}
                               {/* --- FIN MODIFICACIÓN --- */}
                           </Select>
                       )}
                   />
                    {/* Mostrar error si añades validación opcional */}
                   {errors.location?.municipalityCode && <FormHelperText>{errors.location.municipalityCode.message}</FormHelperText>}
                </FormControl>
             </Grid>
             <Grid item xs={12} sm={6}>
                  {/* --- MODIFICACIÓN: Usar location.zone --- */}
                 <TextField fullWidth label="Zona / Barrio (Opcional)" {...register("location.zone")} error={!!errors.location?.zone} helperText={errors.location?.zone?.message} disabled={loading || success}/>
                 {/* --- FIN MODIFICACIÓN --- */}
             </Grid>
             {/* Botón Sugerir Ubicación (sin cambios funcionales aquí, pero revisa lógica de setValue) */}
             <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center'}}> <Button /*...*/ onClick={handleSuggestLocation} /*...*/ >{/*...*/}</Button> </Grid>
            {/* --- Fin Sección Ubicación --- */}

          </Grid>
           )}
           {/* --- Fin Renderizado Condicional --- */}
           {/* Link a Login (sin cambios) */}
           {!success && ( 
           <Typography variant="body2" sx={{ mt: 2 }} > ¿Ya tienes cuenta? <Link /*...*/ onClick={onSwitchToLogin} /*...*/> Inicia sesión aquí </Link> </Typography>
           )}
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px'}}>
          {/* Botones Cancelar/Crear Cuenta (sin cambios) */}
          <Button onClick={onClose} disabled={loading} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading || success}>{loading ? <CircularProgress size={24} color="inherit"/> : 'Crear Cuenta'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  </LocalizationProvider> // Cerrar LocalizationProvider
  );
};

export default RegisterModal;