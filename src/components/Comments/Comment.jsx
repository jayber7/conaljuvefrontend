import React, { useState } from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box, IconButton, Tooltip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Comment = ({ comment, articleId, onDeleteSuccess }) => {
  const { user, isAdmin } = useAuth();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const canDelete = isAdmin || (user && user._id === comment.author?._id);

  const handleDelete = async () => {
    setLoadingDelete(true);
    setErrorDelete('');
    try {
      await api.delete(`/comments/${comment._id}`);
      onDeleteSuccess(); // Llama a la función del padre para actualizar la UI
      // No es necesario cerrar el confirm aquí porque ya se borró el item
    } catch (err) {
      setErrorDelete(err.response?.data?.message || 'Error al eliminar comentario.');
      console.error("Delete comment error:", err);
    } finally {
      setLoadingDelete(false);
      setConfirmOpen(false); // Cierra el diálogo de confirmación
    }
  };

  const handleOpenConfirm = () => setConfirmOpen(true);
  const handleCloseConfirm = () => setConfirmOpen(false);

  const timeAgo = comment.createdAt
    ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: es })
    : '';

  return (
    <>
      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
        <ListItemAvatar sx={{ minWidth: '48px' }}>
          <Avatar sx={{ bgcolor: 'primary.light', width: 36, height: 36 }}>
            {comment.author?.name ? comment.author.name.charAt(0).toUpperCase() : '?'}
            </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography component="span" variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
              {comment.author?.name || 'Usuario Anónimo'}
            </Typography>
          }
          secondary={
            <>
              <Typography
                sx={{ display: 'block' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {comment.text}
              </Typography>
              <Typography variant="caption" color="text.secondary">{timeAgo}</Typography>
               {/* Mostrar error de borrado si existe */}
                {errorDelete && <Typography variant="caption" color="error" sx={{ml: 1}}> {errorDelete} </Typography>}
            </>
          }
        />
        {canDelete && (
            <Tooltip title="Eliminar Comentario">
                <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={handleOpenConfirm}
                    disabled={loadingDelete}
                    size="small"
                >
                   {loadingDelete ? <CircularProgress size={20} /> : <DeleteIcon fontSize="small" />}
                </IconButton>
            </Tooltip>
        )}
      </ListItem>
      {/* Diálogo de Confirmación */}
      <Dialog
          open={confirmOpen}
          onClose={handleCloseConfirm}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Estás seguro de que quieres eliminar este comentario? Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirm} color="inherit" disabled={loadingDelete}>Cancelar</Button>
            <Button onClick={handleDelete} color="error" autoFocus disabled={loadingDelete}>
              {loadingDelete ? <CircularProgress size={20}/> : 'Eliminar'}
            </Button>
          </DialogActions>
       </Dialog>

    </>
  );
};

export default Comment;