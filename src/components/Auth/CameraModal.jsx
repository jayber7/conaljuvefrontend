// src/components/Auth/CameraModal.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, CircularProgress, IconButton, Tooltip, Alert } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
// import SwitchCameraIcon from '@mui/icons-material/SwitchCamera'; // Opcional

const CameraModal = ({ open, onClose, onPictureTaken }) => {
    const [cameraStream, setCameraStream] = useState(null);
    const [error, setError] = useState('');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const stopCameraStream = useCallback(() => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
    }, [cameraStream]);

    // Iniciar cámara al abrir modal
    useEffect(() => {
        if (open) {
            const startCamera = async () => {
                setError('');
                 if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                        setCameraStream(stream);
                        if (videoRef.current) {
                            videoRef.current.srcObject = stream;
                        }
                    } catch (err) {
                        console.error("Error access camera:", err);
                        setError(`No se pudo acceder a la cámara: ${err.name}`);
                        // Considera cerrar el modal o mostrar el error prominentemente
                    }
                 } else {
                      setError("Acceso a cámara no soportado.");
                 }
            };
            startCamera();
        } else {
            // Detener stream cuando se cierra
            stopCameraStream();
        }
        // Limpieza al desmontar o si 'open' cambia a false
        return () => stopCameraStream();
    }, [open, stopCameraStream]); // Depender solo de 'open' y 'stopCameraStream'


    const takePicture = () => {
         if (!videoRef.current || !canvasRef.current || !cameraStream) return;
         const video = videoRef.current;
         const canvas = canvasRef.current;
         const context = canvas.getContext('2d');
         canvas.width = video.videoWidth;
         canvas.height = video.videoHeight;
         context.drawImage(video, 0, 0, canvas.width, canvas.height);

         canvas.toBlob((blob) => {
             if (blob) {
                 const fileName = `conaljuve_cam_pic_${Date.now()}.png`;
                 const pictureFile = new File([blob], fileName, { type: 'image/png' });
                 onPictureTaken(pictureFile); // Llama al callback del padre con el archivo
                 onClose(); // Cierra este modal
             } else {
                 setError("No se pudo capturar la imagen del canvas.");
             }
         }, 'image/png', 0.9);
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm">
            <DialogTitle>Tomar Foto</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box sx={{ width: '100%', aspectRatio: '4/3', bgcolor: 'black', borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
                     <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                     <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                     {!cameraStream && !error && <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} color="inherit" />}
                </Box>
            </DialogContent>
            <DialogActions>
                 <Button onClick={onClose} color="inherit">Cancelar</Button>
                 <Button
                    variant="contained"
                    onClick={takePicture}
                    disabled={!cameraStream || !!error}
                    startIcon={<CameraAltIcon />}
                 >
                     Capturar
                 </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CameraModal;