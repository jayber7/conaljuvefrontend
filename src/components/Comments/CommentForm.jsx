import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import api from '../../services/api';

const CommentForm = ({ articleId, onCommentAdded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post(`/comments/news/${articleId}`, data);
      onCommentAdded(response.data.data.comment); // Pasar el nuevo comentario al padre
      reset(); // Limpiar el formulario
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar el comentario.');
      console.error("Comment post error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, mb: 3 }}>
       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        label="Escribe tu comentario..."
        multiline
        rows={3}
        fullWidth
        variant="outlined"
        {...register("text", { required: "El comentario no puede estar vacío" })}
        error={!!errors.text}
        helperText={errors.text?.message}
        disabled={loading}
        sx={{ mb: 1 }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit"/> : 'Enviar Comentario'}
      </Button>
    </Box>
  );
};

export default CommentForm;