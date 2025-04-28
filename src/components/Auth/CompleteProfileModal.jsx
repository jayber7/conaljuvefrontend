// src/components/Auth/CompleteProfileModal.jsx
import React, { useState, useEffect, useRef, useCallback  } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import {
  Dialog, Menu, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Box, CircularProgress, Alert, Grid, Select, MenuItem, InputLabel, FormControl,
  Input, Avatar, Typography, Paper, Tooltip, IconButton, Divider, Link, FormHelperText // Importar FormHelperText para errores de Select
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera'; // Icono para subir foto
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit'
import UploadFileIcon from '@mui/icons-material/UploadFile'; // Para botón de subir archivo
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DeleteIcon from '@mui/icons-material/Delete'; // Para quitar foto

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
import CameraModal from './CameraModal'; // <-- IMPORTAR MODAL CÁMARA

const CompleteProfileModal  = ({ open, onClose }) => {
  const { user, refetchUser } = useAuth(); // Obtener usuario actual y función para recargar datos
  const [isEditingName, setIsEditingName] = useState(false);
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
const [cameraModalOpen, setCameraModalOpen] = useState(false); // Estado para modal cámara
const [anchorElPhotoMenu, setAnchorElPhotoMenu] = useState(null); // Estado para menú de avatar
const [isCameraOpen, setIsCameraOpen] = useState(false);
const [cameraError, setCameraError] = useState('');
const [cameraStream, setCameraStream] = useState(null);
const videoRef = useRef(null); // Ref para el elemento <video>
const canvasRef = useRef(null); // Ref para el <canvas> oculto
// --- FIN ESTADOS CÁMARA ---
const [pdfData, setPdfData] = useState(null); // Estado para guardar datos del PDF
const { register, handleSubmit, control, watch, setValue, reset, formState: { errors, isDirty } } = useForm({
      defaultValues: {
          name: '',
        //   username: '',
        //   email: '',
        //   password: '',
        //   confirmPassword: '',
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

  // --- useEffect para limpiar preview al cerrar ---
  useEffect(() => {
    if (!open) {
        setProfilePicPreview(null); // Limpiar previsualización al cerrar modal principal
        setIsEditingName(false);
    }
 }, [open]);

// --- Handlers para Menú de Avatar ---
const handlePhotoMenuOpen = (event) => {
    setAnchorElPhotoMenu(event.currentTarget);
};
const handlePhotoMenuClose = () => {
    setAnchorElPhotoMenu(null);
};

// --- Handler para Input File (se activa desde menú) ---
const handleUploadClick = () => {
    handlePhotoMenuClose(); // Cerrar menú
    fileInputRef.current?.click(); // Abrir selector de archivo
};
const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => { setProfilePicPreview(reader.result); };
        reader.readAsDataURL(file);
        setValue('profilePicture', file, { shouldDirty: true }); // Marcar como dirty
    }
};
// --- Fin Handler Input File ---

// --- Handlers para Cámara Modal ---
const handleOpenCameraModal = () => {
    handlePhotoMenuClose(); // Cerrar menú
    setProfilePicPreview(null); // Limpiar preview de archivo si había
    setValue('profilePicture', null);
    setCameraModalOpen(true); // Abrir modal cámara
};
const handleCloseCameraModal = () => {
    setCameraModalOpen(false);
};
const handlePictureTaken = (pictureFile) => {
    // Recibe el archivo desde CameraModal
    if (pictureFile) {
         setValue('profilePicture', pictureFile, { shouldDirty: true }); // Guardar en RHF y marcar dirty
         // Mostrar previsualización
         setProfilePicPreview(URL.createObjectURL(pictureFile));
    }
    // CameraModal se cierra solo después de llamar a onPictureTaken
};
 // --- Handler para quitar foto ---
 const handleRemovePicture = () => {
     handlePhotoMenuClose();
     setProfilePicPreview(null);
     setValue('profilePicture', null, { shouldDirty: true });
     // ¿Necesitas enviar algo al backend para borrar la URL existente?
     // Si es así, necesitarías manejar un estado adicional o un campo especial en el submit.
     // Por ahora, solo limpia la nueva foto/preview. La foto existente en 'user' se mantiene.
 };
// --- Fin Handlers Cámara ---
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
//   // --- Manejo de Selección de Archivo ---
//     const handleFileChange = (event) => {
//         stopCameraStream(); // Detener cámara si estaba abierta
//         setIsCameraOpen(false);
//         const file = event.target.files[0];
//         if (file) {
//             // Previsualización (opcional)
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 console.log("FileReader onloadend:", reader.result ? 'Data URL generado' : 'Sin resultado'); // DEBUG
//                 setProfilePicPreview(reader.result); // <-- Actualiza la previsualización
//             };
//             reader.onerror = (error) => { // DEBUG
//                 console.error("FileReader Error:", error);
//                 setError("Error al leer el archivo de imagen.");
//                 setProfilePicPreview(null);
//            };
//             reader.readAsDataURL(file);
            
//             // Guardar el archivo en el estado del formulario (o manejarlo al submit)
//             // register('profilePicture').onChange(event); // O usar setValue
//             setValue('profilePicture', file); // <-- Guarda el archivo en RHF
//         } else {
//             setProfilePicPreview(null);
//             setValue('profilePicture', null);
//         }
//     };
//     // --- Fin Manejo de Archivo --
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

// --- useEffect para poblar con datos del usuario ---
useEffect(() => {
    if (user && open) {
        console.log("Poblando modal Completar Perfil con datos de:", user);
        reset({
            name: user.name || '',
            location: {
                departmentCode: user.location?.departmentCode || '',
                provinceCode: user.location?.provinceCode || '',
                municipalityCode: user.location?.municipalityCode || '',
                zone: user.location?.zone || ''
            },
            birthDate: user.birthDate ? new Date(user.birthDate) : null,
            gender: typeof user.gender === 'boolean' ? (user.gender ? 'male' : 'female') : '',
            idCard: user.idCard || '',
            idCardExtension: user.idCardExtension || '',
            phoneNumber: user.phoneNumber || '',
            // No resetear profilePicture aquí, se maneja por separado
        });
         // Cargar Prov/Mun si ya hay Depto/Prov en los datos del usuario
    } else if (open) {
        // Si no hay usuario (raro si está abierto) o se abre sin user, resetear
         reset({ /* ... defaultValues vacíos ... */ });
    }
}, [user, open, reset]); // Depender de user y open

  const onSubmit = async (data) => {
    //if (data.password !== data.confirmPassword) { /* ... (manejo error contraseña) ... */ return; }
    setLoading(true); setError(''); setSuccess(false); setPdfData(null); // Resetear PDF data
    

    const profileData = {
             name: data.name,
             location: {
                 departmentCode: data.location.departmentCode ? Number(data.location.departmentCode) : undefined,
                 provinceCode: data.location.provinceCode ? Number(data.location.provinceCode) : undefined,
                 municipalityCode: data.location.municipalityCode ? Number(data.location.municipalityCode) : undefined,
                 zone: data.location.zone || undefined,
             },
             birthDate: data.birthDate ? data.birthDate.toISOString().split('T')[0] : undefined,
             gender: data.gender === 'male' ? true : (data.gender === 'female' ? false : undefined),
             idCard: data.idCard || undefined,
             idCardExtension: data.idCardExtension || undefined,
             phoneNumber: data.phoneNumber || undefined,
        };
         Object.keys(profileData).forEach(key => profileData[key] === undefined && delete profileData[key]);
         Object.keys(profileData.location).forEach(key => profileData.location[key] === undefined && delete profileData.location[key]);
         if (Object.keys(profileData.location).length === 0) delete profileData.location;

    try {
        await api.put('/users/me/profile', profileData);
        setSuccess(true);
        await refetchUser(); // Recargar datos del usuario en el contexto
        const timer = setTimeout(() => { onClose(); }, 2000); // Cerrar después de éxito
        return () => clearTimeout(timer);
   
   setPdfData(dataForPdf);
   // --- FIN GUARDAR DATOS ---
   reset();
   setProfilePicPreview(null);
   // Quitar cierre automático para permitir descarga de PDF
   // const timer = setTimeout(() => { onClose(); }, 2500);
   // return () => clearTimeout(timer);-
} catch (err) { setError(err.message || err.response?.data?.message || 'Error al actualizar perfil.'); }
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
 // Variable para saber qué imagen mostrar en el Avatar principal
 const displayImageUrl = profilePicPreview || user?.profilePictureUrl || undefined;
 // --- DEFINICIÓN DE ESTILOS ---
const styles = {
    dialogContent: {
        bgcolor: 'grey.50',
        p: { xs: 2, sm: 3 }
    },
    paperSection: {
        p: 2.5,
        mb: 3,
        // variant: 'outlined' // No se puede poner variant aquí, se pone en el componente
    },
    sectionTitle: {
        // mb: 2 // O usar gutterBottom en Typography
    },
    avatarContainer: {
        display: 'flex',
        alignItems: 'center',
        mb: 2.5,
        gap: 1
    },
    profileAvatar: {
        width: 60,
        height: 60,
        cursor: 'pointer',
        bgcolor: 'grey.300'
    },
    profileAvatarIcon: {
        fontSize: 30
    },
    nameEditContainer: {
        flexGrow: 1,
        ml: 1
    },
    nameEditFieldBox: {
        display: 'flex',
        alignItems: 'center'
    },
    nameTextField: {
        flexGrow: 1,
        '.MuiInputBase-input': { fontWeight: 500, fontSize: '1rem' }
    },
    editNameButton: {
        ml: 0.5
    },
    locationPaper: { // Estilo específico para ubicación si es necesario
         p: 2.5
    },
    photoPaper: { // Estilo específico para foto
         p: 2.5,
         mb: 3
    },
    photoBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch', // Cambiado para que botones ocupen ancho
        gap: 1.5,
        mt: 1
    },
    // Puedes añadir más estilos reutilizables aquí...
    smallFormControl: { // Ejemplo
        // ...
    },
    smallTextField: { // Ejemplo
         // ...
    }
};
// --- FIN DEFINICIÓN DE ESTILOS ---
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper"> {/* Aumentado a lg */}
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 1 }}>{user?.isProfileComplete ? 'Actualizar Perfil' : 'Completa tu Perfil'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <DialogContent sx={styles.dialogContent}>
            {success && <Alert severity="success" sx={{ mb: 2 }}>¡Perfil actualizado con éxito!</Alert>}
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
                        <Button onClick={onClose} size="small" sx={{ml: 2}}>Cerrar</Button> 
                    </Alert>
                )}

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Ocultar formulario si hubo éxito */}
                {!success && (
                <Grid container spacing={3}> {/* Grid principal */}
                  {/* Columna Izquierda: Datos Personales */}
                  <Grid item xs={12} md={6}>
                                    <Paper sx={styles.paperSection} variant="outlined">
                                        <Typography variant="h6" gutterBottom sx={styles.sectionTitle}> Datos Personales</Typography>

                                        {/* --- AVATAR INTERACTIVO --- */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, gap: 1 }}>
                                             <Tooltip title="Cambiar foto de perfil">
                                                 <IconButton
                                                     onClick={handlePhotoMenuOpen} // Abre el menú de opciones
                                                     sx={{ p: 0 }}
                                                     disabled={loading}
                                                     aria-controls={anchorElPhotoMenu ? 'photo-menu' : undefined}
                                                     aria-haspopup="true"
                                                     aria-expanded={anchorElPhotoMenu ? 'true' : undefined}
                                                 >
                                                     <Avatar src={displayImageUrl} sx={styles.profileAvatar}> 
                                                         {/* Icono si no hay ninguna imagen */}
                                                         {!displayImageUrl && <PersonIcon sx={styles.profileAvatarIcon}/>}
                                                     </Avatar> 
                                                 </IconButton>
                                             </Tooltip>
                                             {/* Input file oculto */}
                                             <input type="file" accept="image/*" onChange={handleFileChange} id="profile-change-file" style={{ display: 'none' }} ref={fileInputRef} {...register('profilePicture')} />

                                             {/* Menú de Opciones para Foto */}
                                             <Menu
                                                 id="photo-menu"
                                                 anchorEl={anchorElPhotoMenu}
                                                 open={Boolean(anchorElPhotoMenu)}
                                                 onClose={handlePhotoMenuClose}
                                                 anchorOrigin={{ vertical: 'bottom', horizontal: 'left'}}
                                                 transformOrigin={{ vertical: 'top', horizontal: 'left'}}
                                             >
                                                 <MenuItem onClick={handleUploadClick}>
                                                     <UploadFileIcon fontSize="small" sx={{ mr: 1 }} /> Subir Archivo
                                                 </MenuItem>
                                                 <MenuItem onClick={handleOpenCameraModal}>
                                                     <CameraAltIcon fontSize="small" sx={{ mr: 1 }} /> Usar Cámara
                                                 </MenuItem>
                                                 {/* Opción para quitar foto seleccionada/actual (si hay alguna) */}
                                                 {(profilePicPreview || user?.profilePictureUrl) && <Divider />}
                                                 {(profilePicPreview || user?.profilePictureUrl) &&
                                                     <MenuItem onClick={handleRemovePicture} sx={{color: 'error.main'}}>
                                                        <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Quitar Foto
                                                     </MenuItem>
                                                  }
                                             </Menu>
                                              {/* --- FIN AVATAR INTERACTIVO --- */}

                                              {/* Nombre/Email (Editable) */}
                                              <Box sx={styles.nameEditContainer}>
                                                <Box sx={styles.nameEditFieldBox}>
                                                     <TextField variant={isEditingName ? "outlined" : "standard"} size="small" sx={styles.nameTextField} {...register("name", { required: true })} /*...*/ />
                                                     <Tooltip title="Editar Nombre"><IconButton size="small" onClick={() => setIsEditingName(!isEditingName)} sx={styles.editNameButton}> <EditIcon /*...*/ /> </IconButton></Tooltip>
                                                 </Box>
                                                  <Typography variant="body2" color="text.secondary" noWrap>{user?.email}</Typography>
                                              </Box>
                                         </Box>
                                        <Divider sx={{ my: 2 }}/>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} sm={7}><Controller name="birthDate" control={control} render={({ field }) => (<DatePicker slotProps={{ textField: { fullWidth: true,  size: 'small', error: !!errors.birthDate, helperText: errors.birthDate?.message,  InputLabelProps: { shrink: true } } }} label="Fecha Nacimiento" {...field} value={field.value || null} disabled={loading} disableFuture/> )}/> </Grid>
                                    <Grid item xs={12} sm={5} style={{ width: '10%' }}>
                                        <FormControl fullWidth size="small" error={!!errors.gender} disabled={loading}>
                                            <InputLabel shrink={true} id="gender-label">Género</InputLabel>
                                            <Controller name="gender" control={control} render={({ field }) => (
                                                <Select label="Género" {...field} style={{ width: '100%' }}>
                                                    <MenuItem value=""><em>(Opcional)</em></MenuItem>
                                                    <MenuItem value="male">Varón</MenuItem>
                                                    <MenuItem value="female">Mujer</MenuItem>
                                                </Select>)}/>
                                        </FormControl> 
                                    </Grid>
                                    <Grid item xs={12} sm={7}><TextField fullWidth size="small" label="Carnet Identidad" {...register("idCard")} error={!!errors.idCard} helperText={errors.idCard?.message} disabled={loading} slotProps={{ inputLabel: { shrink: true } }}/> </Grid>
                                    <Grid item xs={12} sm={5}><FormControl fullWidth size="small" error={!!errors.idCardExtension} disabled={loading}><InputLabel shrink={true} id="idcard-ext-label">Ext.</InputLabel><Controller name="idCardExtension" control={control} render={({ field }) => ( <Select label="Extensión" {...field}> <MenuItem value=""><em>(Opcional)</em></MenuItem>{departments.map((dept) => (<MenuItem key={dept.code} value={dept.code}>{dept.abbreviation || dept.code}</MenuItem>))}</Select> )}/></FormControl> </Grid>
                                    <Grid item xs={12} sm={6}><TextField fullWidth variant="outlined" size="small" label="Número Celular" {...register("phoneNumber")} error={!!errors.phoneNumber} helperText={errors.phoneNumber?.message} disabled={loading} InputLabelProps={{ shrink: true }}/> </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                       
                       {/* --- Columna Derecha (Foto y Ubicación) --- */}
                       <Grid item xs={12} md={6}>
                                     {/* Sección Ubicación */}
                            <Paper sx={styles.locationPaper} variant="outlined">
                                <Typography variant="h6" gutterBottom>Ubicación*</Typography>
                                 <Grid container spacing={2}>
                                     <Grid item xs={12}><Button variant="outlined" size="small" startIcon={<LocationOnIcon />} onClick={handleSuggestLocation} disabled={loadingLocation.suggestion || loading}>Sugerir Ubicación</Button></Grid>
                                     <Grid item xs={12} style={{ width: '20%' }}> <FormControl required fullWidth size="small" error={!!errors.location?.departmentCode} disabled={loadingLocation.dep || loading}><InputLabel shrink={true}>Departamento*</InputLabel><Controller name="location.departmentCode" rules={{ required: 'Departamento es requerido'}} control={control} render={({ field }) => ( <Select label="Departamento*" {...field} fullWidth style={{ width: '100%' }} ><MenuItem value=""><em>Seleccione...</em></MenuItem>{departments.map(d => <MenuItem key={d.code} value={d.code}>{d.name}</MenuItem>)}</Select> )}/></FormControl> </Grid>
                                     <Grid item xs={12}  style={{ width: '20%' }}><FormControl fullWidth size="small" error={!!errors.location?.provinceCode} disabled={!selectedDepartmentCode || loadingLocation.prov || loading}><InputLabel shrink={true}>Provincia</InputLabel><Controller name="location.provinceCode" control={control} render={({ field }) => ( <Select label="Provincia" {...field} ><MenuItem value=""><em>(Opcional)</em></MenuItem>{provinces.map(p => <MenuItem key={p.code} value={p.code}>{p.name}</MenuItem>)}</Select> )}/></FormControl> </Grid>
                                     <Grid item xs={12}  style={{ width: '20%' }}><FormControl fullWidth size="small" error={!!errors.location?.municipalityCode} disabled={!selectedProvinceCode || loadingLocation.mun || loading}><InputLabel shrink={true}>Municipio</InputLabel><Controller name="location.municipalityCode" control={control} render={({ field }) => ( <Select label="Municipio" {...field} ><MenuItem value=""><em>(Opcional)</em></MenuItem>{municipalities.map(m => <MenuItem key={m.code} value={m.code}>{m.name}</MenuItem>)}</Select> )}/></FormControl> </Grid>
                                     <Grid item xs={12}><TextField fullWidth label="Zona / Barrio (Opcional)" size="small" {...register("location.zone")} disabled={loading} InputLabelProps={{ shrink: true }}/></Grid>
                                </Grid>
                            </Paper>
                                </Grid>
                    </Grid>
                )}
                
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px', borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                 {/* Mostrar Cancelar solo si no hubo éxito */}
                 {!success && <Button onClick={onClose} disabled={loading} color="inherit">Cancelar</Button>}
                 {/* Mostrar Crear Cuenta solo si no hubo éxito */}
                 {!success && <Button type="submit" variant="contained" color="primary" disabled={loading}> {loading ? <CircularProgress size={24} color="inherit"/> : 'Guardar Perfil'} </Button>}
                 {/* Mostrar botón Cerrar si hubo éxito */}
                 {success && <Button onClick={onClose} color="primary">Cerrar</Button>}
            </DialogActions>
        </form>
    </Dialog>
</LocalizationProvider>
);
};

export default CompleteProfileModal;