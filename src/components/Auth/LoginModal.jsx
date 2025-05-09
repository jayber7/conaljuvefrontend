import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Box, CircularProgress, Alert, Link, Typography
} from '@mui/material';

const LoginModal = ({ open, onClose, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await login(data);
      onClose(); // Cierra el modal en éxito
    } catch (err) {
      setError(err.message || 'Error desconocido al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Iniciar Sesión</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            id="usernameOrEmail"
            label="Nombre de Usuario o Correo"
            type="text"
            fullWidth
            variant="outlined"
            {...register("usernameOrEmail", { required: "Este campo es requerido" })}
            error={!!errors.usernameOrEmail}
            helperText={errors.usernameOrEmail?.message}
            disabled={loading}
          />
          <TextField
            margin="dense"
            id="password"
            label="Contraseña"
            type="password"
            fullWidth
            variant="outlined"
            {...register("password", { required: "La contraseña es requerida" })}
            error={!!errors.password}
            helperText={errors.password?.message}
            disabled={loading}
          />
           <Typography variant="body2" sx={{ mt: 2 }}>
                ¿No tienes cuenta?{' '}
                <Link component="button" variant="body2" onClick={onSwitchToRegister} disabled={loading}>
                   Regístrate aquí
                </Link>
            </Typography>
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px'}}>
          <Button onClick={onClose} disabled={loading} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" color="secondary" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit"/> : 'Ingresar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoginModal;