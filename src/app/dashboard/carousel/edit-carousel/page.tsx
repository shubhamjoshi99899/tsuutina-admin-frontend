'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import apiService from '@/services/api-service';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Box, Button, Container, IconButton, Stack, TextField, Typography } from '@mui/material';

interface Image {
  _id?: string;
  url: string;
  isVisible: boolean;
}

interface CarouselType {
  _id: string;
  name: string;
  images: Image[];
  isActive: boolean;
}

const EditCarouselPage = (): React.JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [name, setName] = useState<string>('');
  const [images, setImages] = useState<Image[]>([]);
  const [carousel, setCarousel] = useState<CarouselType | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCarousel(id);
    }
  }, [id]);

  const fetchCarousel = async (carouselId: string) => {
    try {
      const response = await apiService.getCarouselById(carouselId);
      const carouselData = response.data.data;
      setCarousel(carouselData);
      setName(carouselData.name);
      setImages(carouselData.images);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() !== '') {
      setImages([...images, { url: newImageUrl, isVisible: true }]);
      setNewImageUrl('');
    }
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
      if (carousel) {
        const response = await apiService.updateCarousel(carousel._id, { name, images });
        if (response.data.success) {
          router.push('/dashboard/carousel');
        }
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
        Edit Carousel
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
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          label="New Image URL"
          fullWidth
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
          onBlur={handleAddImage}
        />
        <IconButton onClick={handleAddImage}>
          <AddIcon />
        </IconButton>
      </Box>
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Carousel
        </Button>
        <Button variant="outlined" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          onClick={() =>
            router.push(
              'https://www.google.com/maps/place/Grey+Eagle+Resort+and+Casino/@51.0074946,-114.1472472,17z/data=!3m1!4b1!4m9!3m8!1s0x537171edbde2ad0d:0x9ecba17eab6c70f2!5m2!4m1!1i2!8m2!3d51.0074946!4d-114.1472472!16s%2Fg%2F1tc_8bgd?entry=ttu'
            )
          }
          variant="contained"
        >
          hey
        </Button>
      </Stack>
    </Container>
  );
};

export default EditCarouselPage;
