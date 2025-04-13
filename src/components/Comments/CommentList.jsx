import React from 'react';
import { Box, Typography, List } from '@mui/material';
import Comment from './Comment'; // Crear este componente

const CommentList = ({ comments = [], articleId, onCommentDeleted }) => {
  if (!comments || comments.length === 0) {
    return <Typography sx={{ my: 3, textAlign: 'center', color: 'text.secondary' }}>Aún no hay comentarios.</Typography>;
  }

  return (
    <List sx={{ width: '100%' }}>
      {comments.map((comment) => (
        <Comment
            key={comment._id}
            comment={comment}
            articleId={articleId}
            onDeleteSuccess={() => onCommentDeleted(comment._id)}
        />
      ))}
    </List>
  );
};

export default CommentList;