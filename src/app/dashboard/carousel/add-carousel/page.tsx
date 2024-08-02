'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api-service';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Box, Button, Container, IconButton, Stack, TextField, Typography } from '@mui/material';

interface Image {
  url: string;
  isVisible: boolean;
}

const AddCarouselPage = (): React.JSX.Element => {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [images, setImages] = useState<Image[]>([{ url: '', isVisible: true }]);
  const [error, setError] = useState<string | null>(null);

  const handleAddImage = () => {
    setImages([...images, { url: '', isVisible: true }]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = images.map((image, i) => (i === index ? { ...image, url: value } : image));
    setImages(newImages);
  };

  const handleSave = async () => {
    try {
      const response = await apiService.createCarousel({ name, images });
      if (response.data.success) {
        router.push('/dashboard/carousel');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <Container>
      {error && <Typography color="error">{error}</Typography>}
      <Typography variant="h4" sx={{ mb: 3 }}>
        Add New Carousel
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField label="Carousel Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
      </Box>
      {images.map((image, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Image URL"
            fullWidth
            value={image.url}
            onChange={(e) => handleImageChange(index, e.target.value)}
          />
          <IconButton onClick={() => handleRemoveImage(index)}>
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
      <Button variant="contained" onClick={handleAddImage} startIcon={<AddIcon />}>
        Add Image
      </Button>
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Carousel
        </Button>
        <Button variant="outlined" onClick={() => router.back()}>
          Cancel
        </Button>
      </Stack>
    </Container>
  );
};

export default AddCarouselPage;
