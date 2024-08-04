'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { Carousel } from 'react-responsive-carousel';

import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Requires npm install react-responsive-carousel

import apiService from '@/services/api-service';
import { Add as AddIcon, Edit as EditIcon, Remove as RemoveIcon } from '@mui/icons-material';

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

function CarouselListPage(): React.JSX.Element {
  const [carousels, setCarousels] = useState<CarouselType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCarousels();
  }, []);

  const fetchCarousels = async () => {
    try {
      const response = await apiService.getCarousels();
      setCarousels(response.data.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleSetActive = async (carouselId: string) => {
    try {
      await apiService.setCarouselActive(carouselId);
      fetchCarousels(); // Refresh carousels after setting active
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleImageVisibilityChange = async (carouselId: string, imageId: string, isVisible: boolean) => {
    try {
      const carousel = carousels.find((c) => c._id === carouselId);
      if (!carousel) return;
      const updatedImages = carousel.images.map((image) => (image._id === imageId ? { ...image, isVisible } : image));
      await apiService.updateCarousel(carouselId, { images: updatedImages });
      fetchCarousels(); // Refresh carousels after updating visibility
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <Container maxWidth="xl">
      {error ? <Typography color="error">{error}</Typography> : null}
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4" sx={{ mb: 3 }}>
          Carousels
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Link href="/dashboard/carousel/add-carousel" passHref>
            <Button variant="contained" color="primary" startIcon={<AddIcon />}>
              Add New Carousel
            </Button>
          </Link>
        </Box>
      </Stack>
      <Grid container spacing={4}>
        {carousels.map((carousel) => (
          <Grid item xs={12} sm={6} md={4} key={carousel._id}>
            <Card sx={{ p: 1, height: 350 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{carousel.name}</Typography>
                  <Button
                    variant="contained"
                    onClick={() => handleSetActive(carousel._id)}
                    disabled={carousel.isActive}
                  >
                    {carousel.isActive ? 'Active' : 'Set as Active'}
                  </Button>
                  <Link href={`/dashboard/carousel/edit-carousel?id=${carousel._id}`} passHref>
                    <Button variant="contained" color="secondary" sx={{ ml: 1 }}>
                      Edit Carousel
                    </Button>
                  </Link>
                </Stack>
              </CardContent>
              <CardMedia>
                <Carousel showThumbs={false} showStatus={false} infiniteLoop>
                  {carousel.images
                    .filter((image) => image.isVisible)
                    .map((image, index) => (
                      <div key={index}>
                        <img src={image.url} alt={`carousel-image-${index}`} />
                      </div>
                    ))}
                </Carousel>
              </CardMedia>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default CarouselListPage;
