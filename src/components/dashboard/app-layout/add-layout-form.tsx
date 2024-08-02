import React, { useState } from 'react';
import apiService from '@/services/api-service';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';

interface Route {
  name: string;
  path: string;
  icon: string;
  isCurrentlyUsed: boolean;
}

interface AddLayoutFormProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export function AddLayoutForm({ open, onClose, onAdd }: AddLayoutFormProps): React.JSX.Element {
  const [name, setName] = useState<string>('');
  const [routes, setRoutes] = useState<Route[]>([{ name: '', path: '', icon: '', isCurrentlyUsed: false }]);

  const handleAddRoute = () => {
    setRoutes([...routes, { name: '', path: '', icon: '', isCurrentlyUsed: false }]);
  };

  const handleRemoveRoute = (index: number) => {
    const newRoutes = routes.filter((_, i) => i !== index);
    setRoutes(newRoutes);
  };

  const handleRouteChange = (index: number, field: keyof Route, value: string | boolean) => {
    const newRoutes = routes.map((route, i) => (i === index ? { ...route, [field]: value } : route));
    setRoutes(newRoutes);
  };

  const handleAdd = async () => {
    try {
      await apiService.createLayout({ name, routes });
      onAdd(); // Trigger the parent component's update function
      onClose(); // Close the form dialog
    } catch (error) {
      console.error('Failed to create layout:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Layout</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Layout Name"
          fullWidth
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        {routes.map((route, index) => (
          <div key={index}>
            <TextField
              margin="dense"
              label="Route Name"
              fullWidth
              value={route.name}
              onChange={(e) => {
                handleRouteChange(index, 'name', e.target.value);
              }}
            />
            <TextField
              margin="dense"
              label="Route Path"
              fullWidth
              value={route.path}
              onChange={(e) => {
                handleRouteChange(index, 'path', e.target.value);
              }}
            />
            <TextField
              margin="dense"
              label="Route Icon"
              fullWidth
              value={route.icon}
              onChange={(e) => {
                handleRouteChange(index, 'icon', e.target.value);
              }}
            />
            <div>
              <IconButton onClick={() => handleRemoveRoute(index)}>
                <RemoveIcon />
              </IconButton>
              <IconButton onClick={handleAddRoute}>
                <AddIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} variant="contained" color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddLayoutForm;
