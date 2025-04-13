import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api'; // Para llamar a endpoints de ubicación
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Box, CircularProgress, Alert, Grid, Select, MenuItem, InputLabel, FormControl,
  Typography, Link
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const RegisterModal = ({ open, onClose, onSwitchToLogin }) => {
  const { register: authRegister } = useAuth(); // Renombrar para evitar conflicto
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState({ dep: false, prov: false, mun: false, suggestion: false });

  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
      defaultValues: { // Valores iniciales
          name: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          location: { department: '', province: '', municipality: '', zone: '' }
      }
  });

  const selectedDepartment = watch('location.department');
  const selectedProvince = watch('location.province');

  // --- Fetch Ubicaciones ---
  useEffect(() => { // Fetch Departamentos al montar/abrir
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
        setSuccess(false); // Resetear éxito al abrir
        setError('');
        reset(); // Limpiar formulario al abrir
    } else {
        // Limpiar listas cuando se cierra
        setDepartments([]);
        setProvinces([]);
        setMunicipalities([]);
    }
  }, [open, reset]);

  useEffect(() => { // Fetch Provincias cuando cambia Departamento
    if (selectedDepartment) {
        const fetchProvinces = async () => {
             setLoadingLocation(prev => ({ ...prev, prov: true }));
             // Limpiar provincia/municipio anteriores al cambiar depto
             setValue('location.province', '');
             setValue('location.municipality', '');
             setMunicipalities([]);
             try {
                const response = await api.get(`/locations/provinces?departmentId=${selectedDepartment}`);
                setProvinces(response.data.data.provinces || []);
             } catch (err) { console.error("Error fetching provinces:", err); setProvinces([]);} // Limpiar en error
             finally{ setLoadingLocation(prev => ({ ...prev, prov: false }));}
        };
        fetchProvinces();
    } else {
      setProvinces([]); // Limpiar si no hay departamento
      setMunicipalities([]);
    }
  }, [selectedDepartment, setValue]);

   useEffect(() => { // Fetch Municipios cuando cambia Provincia
    if (selectedProvince) {
        const fetchMunicipalities = async () => {
             setLoadingLocation(prev => ({ ...prev, mun: true }));
             setValue('location.municipality', ''); // Limpiar municipio anterior
             try {
                const response = await api.get(`/locations/municipalities?provinceId=${selectedProvince}`);
                setMunicipalities(response.data.data.municipalities || []);
             } catch (err) { console.error("Error fetching municipalities:", err); setMunicipalities([]); }
             finally{ setLoadingLocation(prev => ({ ...prev, mun: false }));}
        };
        fetchMunicipalities();
    } else {
      setMunicipalities([]);
    }
  }, [selectedProvince, setValue]);
  // --- Fin Fetch Ubicaciones ---

  // --- Sugerencia de Ubicación (Geolocation) ---
  const handleSuggestLocation = () => {
      if (!navigator.geolocation) {
          setError("Geolocalización no es soportada por tu navegador.");
          return;
      }
      setLoadingLocation(prev => ({ ...prev, suggestion: true }));
      setError('');
      navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          try {
              const response = await api.get(`/locations/suggestions?lat=${latitude}&lon=${longitude}`);
              const suggestion = response.data.data.suggestion;
              if (suggestion) {
                  // Llenar campos - ¡Necesitas mapear nombre a ID si usas IDs!
                  // Esto asume que los nombres coinciden por ahora
                  setValue('location.department', suggestion.department || '', { shouldValidate: true });
                  // Esperar a que carguen provincias/municipios antes de setearlos
                  // O buscar los IDs correspondientes
                  // setValue('location.province', suggestion.province || '', { shouldValidate: true });
                  // setValue('location.municipality', suggestion.municipality || '', { shouldValidate: true });
                  setValue('location.zone', suggestion.zone || '', { shouldValidate: true });
                  // Trigger fetch de provincias/municipios si se encontró depto
                  // Esto se hará automáticamente por los useEffect de watch
              } else {
                  setError("No se pudo obtener sugerencia para tu ubicación.");
              }
          } catch (err) {
              setError("Error al obtener sugerencia de ubicación.");
              console.error(err);
          } finally {
              setLoadingLocation(prev => ({ ...prev, suggestion: false }));
          }
      }, (geoError) => {
           setLoadingLocation(prev => ({ ...prev, suggestion: false }));
           setError(`Error de Geolocalización: ${geoError.message}`);
      });
  }
   // --- Fin Sugerencia ---


  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);

    // Excluir confirmPassword antes de enviar
    const { confirmPassword, ...userData } = data;

    try {
      await authRegister(userData);
      setSuccess(true); // Mostrar mensaje de éxito
      reset(); // Limpiar formulario en éxito
      // Podrías cerrar automáticamente o dejar que el usuario lo haga
       // setTimeout(() => {
       //     onClose();
       //     onSwitchToLogin(); // Opcional: abrir login después de registrar
       // }, 2000);
    } catch (err) {
      setError(err.message || 'Error desconocido al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Crear Cuenta</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>¡Registro exitoso! Ahora puedes iniciar sesión.</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Nombre Completo" {...register("name", { required: "Nombre requerido" })} error={!!errors.name} helperText={errors.name?.message} disabled={loading || success}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Nombre de Usuario" {...register("username", { required: "Usuario requerido" })} error={!!errors.username} helperText={errors.username?.message} disabled={loading || success}/>
            </Grid>
            <Grid item xs={12}>
               <TextField fullWidth label="Correo Electrónico" type="email" {...register("email", { required: "Correo requerido", pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" } })} error={!!errors.email} helperText={errors.email?.message} disabled={loading || success}/>
            </Grid>
             <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Contraseña" type="password" {...register("password", { required: "Contraseña requerida", minLength: { value: 6, message: "Mínimo 6 caracteres" } })} error={!!errors.password} helperText={errors.password?.message} disabled={loading || success}/>
            </Grid>
             <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Confirmar Contraseña" type="password" {...register("confirmPassword", { required: "Confirma la contraseña" })} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} disabled={loading || success}/>
            </Grid>

            {/* --- Sección Ubicación --- */}
            <Grid item xs={12}> <Typography variant="subtitle1" sx={{mt: 1}}>Ubicación</Typography></Grid>

            <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth error={!!errors.location?.department}>
                   <InputLabel id="department-label">Departamento*</InputLabel>
                   <Controller
                       name="location.department"
                       control={control}
                       rules={{ required: 'Departamento es requerido' }}
                       render={({ field }) => (
                           <Select labelId="department-label" label="Departamento*" {...field} disabled={loading || loadingLocation.dep || success}>
                               <MenuItem value=""><em>Seleccione...</em></MenuItem>
                               {departments.map((dep) => (
                                   <MenuItem key={dep.id || dep.name} value={dep.id || dep.name}>{dep.name}</MenuItem>
                               ))}
                           </Select>
                       )}
                   />
                   {errors.location?.department && <Typography color="error" variant="caption">{errors.location.department.message}</Typography>}
                </FormControl>
            </Grid>
             <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth error={!!errors.location?.province} disabled={!selectedDepartment || loadingLocation.prov || loading || success}>
                   <InputLabel id="province-label">Provincia</InputLabel>
                    <Controller
                       name="location.province"
                       control={control}
                       render={({ field }) => (
                           <Select labelId="province-label" label="Provincia" {...field}>
                               <MenuItem value=""><em>{loadingLocation.prov ? 'Cargando...' : 'Seleccione...'}</em></MenuItem>
                                {provinces.map((prov) => (
                                   <MenuItem key={prov.id || prov.name} value={prov.id || prov.name}>{prov.name}</MenuItem>
                               ))}
                           </Select>
                       )}
                   />
                   {/* Helper text opcional */}
                </FormControl>
            </Grid>
             <Grid item xs={12} sm={6} md={4}>
                 <FormControl fullWidth error={!!errors.location?.municipality} disabled={!selectedProvince || loadingLocation.mun || loading || success}>
                   <InputLabel id="municipality-label">Municipio</InputLabel>
                    <Controller
                       name="location.municipality"
                       control={control}
                       render={({ field }) => (
                           <Select labelId="municipality-label" label="Municipio" {...field}>
                               <MenuItem value=""><em>{loadingLocation.mun ? 'Cargando...' : 'Seleccione...'}</em></MenuItem>
                               {municipalities.map((mun) => (
                                   <MenuItem key={mun.id || mun.name} value={mun.id || mun.name}>{mun.name}</MenuItem>
                               ))}
                           </Select>
                       )}
                   />
                   {/* Helper text opcional */}
                </FormControl>
             </Grid>
             <Grid item xs={12} sm={6}>
                 <TextField fullWidth label="Zona / Barrio (Opcional)" {...register("location.zone")} error={!!errors.location?.zone} helperText={errors.location?.zone?.message} disabled={loading || success}/>
             </Grid>
              <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center'}}>
                 <Button
                    variant="outlined"
                    startIcon={<LocationOnIcon />}
                    onClick={handleSuggestLocation}
                    disabled={loadingLocation.suggestion || loading || success}
                    fullWidth
                  >
                    {loadingLocation.suggestion ? <CircularProgress size={20} /> : 'Sugerir Ubicación'}
                  </Button>
             </Grid>
            {/* --- Fin Sección Ubicación --- */}

          </Grid>
           <Typography variant="body2" sx={{ mt: 2 }}>
                ¿Ya tienes cuenta?{' '}
                <Link component="button" variant="body2" onClick={onSwitchToLogin} disabled={loading || success}>
                   Inicia sesión aquí
                </Link>
            </Typography>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px'}}>
          <Button onClick={onClose} disabled={loading} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading || success}>
            {loading ? <CircularProgress size={24} color="inherit"/> : 'Crear Cuenta'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RegisterModal;