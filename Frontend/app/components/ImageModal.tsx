// src/ImageModal.tsx
"use client"
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Dialog, DialogTitle, DialogContent, IconButton,
  Box, CircularProgress, Typography, Zoom,
  Chip, Paper, alpha, Fade, Slider
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RotateRightRoundedIcon from '@mui/icons-material/RotateRightRounded';
import FullscreenRoundedIcon from '@mui/icons-material/FullscreenRounded';

interface Props {
  open: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageModal: React.FC<Props> = ({ open, onClose, imageUrl }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const prevUrlRef = useRef<string>('');
  useEffect(() => {
    if (open && imageUrl && prevUrlRef.current !== imageUrl) {
      prevUrlRef.current = imageUrl;
    }
  }, [open, imageUrl]);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    setLoading(false);
    setImageDimensions({
      width: img.naturalWidth,
      height: img.naturalHeight
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    // Extract filename from the full URL
    link.download = imageUrl.split('/').pop() || 'inspection-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleZoomChange = (_event: Event, newValue: number | number[]) => {
    setZoom(newValue as number);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFullscreen = () => {
    const imgElement = document.querySelector('.inspection-image') as HTMLElement;
    if (imgElement && imgElement.requestFullscreen) {
      imgElement.requestFullscreen();
    }
  };

  // Safely extract filename for display
  const filename = imageUrl ? imageUrl.split('/').pop() || 'inspection-image.jpg' : '';
  const fileExtension = filename.split('.').pop()?.toUpperCase() || 'IMAGE';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      TransitionComponent={Zoom}
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          background: 'white',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5)',
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(10px)',
        color: 'black',
        py: 2.5,
        px: 3,
        borderBottom: '1px solid',
        borderColor: alpha('#000000', 0.1)
      }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              bgcolor: alpha('#667eea', 0.2),
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 20, color: '#a0aec0' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} letterSpacing="0.5px">
              Inspection Image Viewer
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {filename.length > 40 ? `${filename.substring(0, 40)}...` : filename}
              <Chip 
                label={fileExtension}
                size="small"
                sx={{ 
                  ml: 1,
                  height: 18,
                  fontSize: '0.6rem',
                  bgcolor: 'black',
                  color: 'white'
                }}
              />
            </Typography>
          </Box>
        </Box>
        
        <Box display="flex" gap={1}>
          <Chip 
            label={`${Math.round(zoom * 100)}%`}
            size="small"
            sx={{ 
              bgcolor: 'white',
              color: 'black',
              fontWeight: 600,
              border: '1px solid',
              borderColor: alpha('#000000', 0.1)
            }}
          />
          <IconButton onClick={() => setZoom(Math.min(zoom + 0.25, 3))} size="small" sx={{ bgcolor: alpha('#000000', 0.05) }}>
            <ZoomInRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => setZoom(Math.max(zoom - 0.25, 0.5))} size="small" sx={{ bgcolor: alpha('#000000', 0.05) }}>
            <ZoomOutRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={handleRotate} size="small" sx={{ bgcolor: alpha('#000000', 0.05) }}>
            <RotateRightRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={handleFullscreen} size="small" sx={{ bgcolor: alpha('#000000', 0.05) }}>
            <FullscreenRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={handleDownload} size="small" sx={{ bgcolor: alpha('#000000', 0.05) }}>
            <DownloadRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={onClose} size="small" sx={{ bgcolor: alpha('#000000', 0.05), '&:hover': { bgcolor: alpha('#f56565', 0.5) } }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ 
        p: 4,
        background: 'linear-gradient(145deg, #1a202c 0%, #2d3748 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh'
      }}>
        <Paper
          elevation={0}
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: alpha('#000000', 0.03),
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: alpha('#000000', 0.1)
          }}
        >
          {loading && !error && (
            <Fade in={loading}>
              <Box position="absolute" textAlign="center">
                <CircularProgress size={60} thickness={4} sx={{ color: '#667eea', mb: 2 }} />
                <Typography variant="body1" color="white" fontWeight={500}>
                  Loading high-resolution image...
                </Typography>
              </Box>
            </Fade>
          )}

          {error && (
            <Fade in={error}>
              <Box textAlign="center">
                <BrokenImageOutlinedIcon sx={{ fontSize: 100, color: alpha('#f56565', 0.5), mb: 2 }} />
                <Typography variant="h5" color="white" fontWeight={700} gutterBottom>
                  Image Unavailable
                </Typography>
                <Typography variant="body2" color={alpha('#ffffff', 0.5)}>
                  Could not load image from:<br/> {imageUrl}
                </Typography>
              </Box>
            </Fade>
          )}

          {imageUrl && !error && (
            <Box
              sx={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: 'transform 0.3s ease',
                transformOrigin: 'center center',
                position: 'relative',
                width: imageDimensions.width > 0 ? imageDimensions.width : '100%',
                height: imageDimensions.height > 0 ? imageDimensions.height : '70vh', // Default height before load
                maxWidth: '100%',
                maxHeight: '70vh',
              }}
            >
              <Image
                src={imageUrl}
                alt="Battery Inspection"
                className="inspection-image"
                unoptimized={true}
                onLoad={handleImageLoad}
                onError={() => {
                  setLoading(false);
                  setError(true);
                }}
                fill
                style={{
                  objectFit: 'contain',
                  opacity: loading ? 0 : 1,
                  transition: 'opacity 0.3s ease',
                  borderRadius: '12px',
                }}
              />
            </Box>
          )}

          {/* Image Info Overlay */}
          {imageDimensions.width > 0 && !error && !loading && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 2,
                fontSize: '0.75rem',
                backdropFilter: 'blur(5px)',
                border: '1px solid',
                borderColor: alpha('#ffffff', 0.1)
              }}
            >
              {imageDimensions.width} × {imageDimensions.height} pixels
            </Box>
          )}
        </Paper>

        {/* Zoom Slider */}
        {!loading && !error && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 300,
              bgcolor: 'rgba(0,0,0,0.6)',
              borderRadius: 4,
              p: 2,
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: alpha('#ffffff', 0.1)
            }}
          >
            <Slider
              value={zoom}
              min={0.5}
              max={3}
              step={0.1}
              onChange={handleZoomChange}
              sx={{
                color: '#667eea',
                '& .MuiSlider-thumb': {
                  width: 20,
                  height: 20,
                  backgroundColor: '#fff',
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: '0 0 0 8px rgba(102, 126, 234, 0.16)'
                  }
                }
              }}
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;