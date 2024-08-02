import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import apiService from '@/services/api-service';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Card, Container, Grid, IconButton, Stack, Typography } from '@mui/material';
import type { AxiosResponse } from 'axios';

interface Route {
  name: string;
  path: string;
  icon: string;
  isCurrentlyUsed: boolean;
}

interface Layout {
  _id: string;
  name: string;
  routes: Route[];
  isCurrentlySet: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface LayoutListProps {
  onEditLayoutClick: (layout: Layout) => void;
  refreshTrigger: number; // Receive refreshTrigger as a prop
}

export default function LayoutList({ onEditLayoutClick, refreshTrigger }: LayoutListProps): React.JSX.Element {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchLayout = async () => {
    apiService
      .getLayouts()
      .then((response: AxiosResponse<ApiResponse<Layout[]>>) => {
        setLayouts(response.data.data);
      })
      .catch((err) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      });
  };

  useEffect(() => {
    fetchLayout();
  }, [refreshTrigger]); // Add refreshTrigger to the dependency array

  const handleDeleteLayout = (id: string) => {
    apiService
      .deleteLayout(id)
      .then((response: AxiosResponse<ApiResponse<Layout>>) => {
        setLayouts(layouts.filter((layout) => layout._id !== id));
      })
      .catch((err) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      });
  };

  const setLayout = async (id: string) => {
    try {
      await apiService.setLayout(id);
      const response = await apiService.getLayouts();
      setLayouts(response.data.data);
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
      {error && <Typography color="error">{error}</Typography>}
      {layouts.length === 0 && <Typography>No layouts found</Typography>}
      <Grid container spacing={10}>
        {layouts.map((layout) => (
          <Grid key={layout._id} item xs={12} sm={6} md={4}>
            <Card
              key={layout._id}
              sx={{
                p: 2,
                minWidth: 300,
                border: layout?.isCurrentlySet ? '1px solid green' : 'none',
                background: layout?.isCurrentlySet ? '#F5FFFA' : '#FFF0F5',
              }}
            >
              <Stack direction="row" justifyContent={'space-between'} alignItems={'center'}>
                <Box>
                  <Typography fontWeight={700}>{layout.name}</Typography>
                  <Typography>{layout.routes.map((route) => route.name).join(', ')}</Typography>
                </Box>
                <IconButton onClick={() => handleDeleteLayout(layout._id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Stack>
              <Button variant="contained" color="primary" onClick={() => setLayout(layout._id)} sx={{ mt: 2 }}>
                Set as Current
              </Button>
              <Button variant="contained" color="secondary" sx={{ mt: 2, ml: 2 }}>
                <Link
                  href={`/dashboard/app-layout/${layout._id}/edit-layout`}
                  style={{ textDecoration: 'none', color: '#fff' }}
                  passHref
                >
                  Edit
                </Link>
              </Button>
              <Link href={`/dashboard/app-layout/${layout._id}`} passHref>
                <Button variant="outlined" color="secondary" sx={{ mt: 2, ml: 2 }}>
                  View Details
                </Button>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
