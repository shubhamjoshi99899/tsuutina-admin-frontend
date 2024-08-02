'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiService from '@/services/api-service';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

interface Route {
  _id?: string;
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

const EditLayoutPage = (): React.JSX.Element => {
  const router = useRouter();
  const { id } = useParams();
  const [name, setName] = useState<string>('');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null); // Track which route is being deleted

  useEffect(() => {
    if (id) {
      apiService
        .getLayoutById(id as string)
        .then((response) => {
          const layoutData = response.data.data;
          setLayout(layoutData);
          setName(layoutData.name);
          setRoutes(layoutData.routes);
        })
        .catch((err) => {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred');
          }
        });
    }
  }, [id]);

  const handleAddRoute = () => {
    setRoutes([...routes, { name: '', path: '', icon: '', isCurrentlyUsed: false }]);
  };

  const handleRemoveRoute = async () => {
    if (deleteIndex !== null) {
      const routeId = routes[deleteIndex]._id;
      if (routeId && layout) {
        await apiService.removeRouteFromLayout(layout._id, routeId);
      }
      const newRoutes = routes.filter((_, i) => i !== deleteIndex);
      setRoutes(newRoutes);
      setDeleteIndex(null); // Reset delete index after deletion
    }
  };

  const handleRouteChange = (index: number, field: keyof Route, value: string | boolean) => {
    const newRoutes = routes.map((route, i) => (i === index ? { ...route, [field]: value } : route));
    setRoutes(newRoutes);
  };

  const handleSave = async () => {
    if (layout) {
      try {
        await apiService.updateLayout(layout._id, { routes });
        router.push('/'); // Navigate back to the main page after saving
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    }
  };

  const confirmDelete = (index: number) => {
    setDeleteIndex(index); // Set which route is being deleted
  };

  const cancelDelete = () => {
    setDeleteIndex(null); // Cancel deletion
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Edit Layout
      </Typography>
      <TextField margin="dense" label="Layout Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
      {routes.map((route, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '4px' }}>
          <TextField
            margin="dense"
            label="Route Name"
            fullWidth
            value={route.name}
            onChange={(e) => handleRouteChange(index, 'name', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Route Path"
            fullWidth
            value={route.path}
            onChange={(e) => handleRouteChange(index, 'path', e.target.value)}
          />
          <TextField
            margin="dense"
            label="Route Icon"
            fullWidth
            value={route.icon}
            onChange={(e) => handleRouteChange(index, 'icon', e.target.value)}
          />
          <Stack direction="row" spacing={1}>
            <IconButton onClick={() => confirmDelete(index)}>
              <RemoveIcon />
            </IconButton>
          </Stack>
        </Box>
      ))}
      <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleAddRoute} sx={{ mb: 2 }}>
        Add Route
      </Button>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="outlined" onClick={() => router.back()}>
          Cancel
        </Button>
      </Stack>

      {/* Confirmation dialog for deletion */}
      <Dialog open={deleteIndex !== null} onClose={cancelDelete} aria-labelledby="delete-confirmation-dialog">
        <DialogTitle id="delete-confirmation-dialog">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this route?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRemoveRoute} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditLayoutPage;
