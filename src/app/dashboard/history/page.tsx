'use client';

import React, { useEffect, useState } from 'react';
import apiService from '@/services/api-service';
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

interface HistoryItem {
  _id?: string;
  title: string;
  yearsFrom: number;
  yearsUpto: number;
  image: string;
  description: string;
  index: number;
  isCurrentlyVisible: boolean;
}

const HistoryManagementPage = (): React.JSX.Element => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [newHistoryItem, setNewHistoryItem] = useState<HistoryItem>({
    title: '',
    yearsFrom: 0,
    yearsUpto: 0,
    image: '',
    description: '',
    index: 0,
    isCurrentlyVisible: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistoryItems();
  }, []);

  const fetchHistoryItems = async () => {
    try {
      const response = await apiService.getHistoryItems();
      setHistoryItems(response.data.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleSave = async () => {
    try {
      if (selectedItem) {
        await apiService.updateHistoryItem(selectedItem._id!, selectedItem);
      } else {
        await apiService.createHistoryItem(newHistoryItem);
      }
      fetchHistoryItems();
      setDialogOpen(false);
      setSelectedItem(null);
      setNewHistoryItem({
        title: '',
        yearsFrom: 0,
        yearsUpto: 0,
        image: '',
        description: '',
        index: 0,
        isCurrentlyVisible: true,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteHistoryItem(id);
      fetchHistoryItems();
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
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          History Management
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Add New History Item
          </Button>
        </Box>
      </Stack>
      {historyItems.map((item) => (
        <Card key={item._id} sx={{ mb: 2, p: 2 }}>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <img src={item.image} alt={item.title} width={150} height={150} style={{ borderRadius: '12px' }} />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {item.title}
              </Typography>

              <Typography>{item.description}</Typography>
            </Box>
          </Stack>
          <Stack direction="row" gap={2} mt={2}>
            <Switch
              checked={item.isCurrentlyVisible}
              onChange={async (e) => {
                await apiService.updateHistoryItem(item._id!, { ...item, isCurrentlyVisible: e.target.checked });
                fetchHistoryItems();
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setSelectedItem(item);
                setDialogOpen(true);
              }}
            >
              Edit
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleDelete(item._id!)}>
              Delete
            </Button>
          </Stack>
        </Card>
      ))}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{selectedItem ? 'Edit History Item' : 'Add New History Item'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            fullWidth
            value={selectedItem ? selectedItem.title : newHistoryItem.title}
            onChange={(e) => {
              if (selectedItem) {
                setSelectedItem({ ...selectedItem, title: e.target.value });
              } else {
                setNewHistoryItem({ ...newHistoryItem, title: e.target.value });
              }
            }}
          />
          <TextField
            margin="dense"
            label="Years From"
            fullWidth
            type="number"
            value={selectedItem ? selectedItem.yearsFrom : newHistoryItem.yearsFrom}
            onChange={(e) => {
              if (selectedItem) {
                setSelectedItem({ ...selectedItem, yearsFrom: Number(e.target.value) });
              } else {
                setNewHistoryItem({ ...newHistoryItem, yearsFrom: Number(e.target.value) });
              }
            }}
          />
          <TextField
            margin="dense"
            label="Years Upto"
            fullWidth
            type="number"
            value={selectedItem ? selectedItem.yearsUpto : newHistoryItem.yearsUpto}
            onChange={(e) => {
              if (selectedItem) {
                setSelectedItem({ ...selectedItem, yearsUpto: Number(e.target.value) });
              } else {
                setNewHistoryItem({ ...newHistoryItem, yearsUpto: Number(e.target.value) });
              }
            }}
          />
          <TextField
            margin="dense"
            label="Image URL"
            fullWidth
            value={selectedItem ? selectedItem.image : newHistoryItem.image}
            onChange={(e) => {
              if (selectedItem) {
                setSelectedItem({ ...selectedItem, image: e.target.value });
              } else {
                setNewHistoryItem({ ...newHistoryItem, image: e.target.value });
              }
            }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={selectedItem ? selectedItem.description : newHistoryItem.description}
            onChange={(e) => {
              if (selectedItem) {
                setSelectedItem({ ...selectedItem, description: e.target.value });
              } else {
                setNewHistoryItem({ ...newHistoryItem, description: e.target.value });
              }
            }}
          />
          <TextField
            margin="dense"
            label="Index"
            fullWidth
            type="number"
            value={selectedItem ? selectedItem.index : newHistoryItem.index}
            onChange={(e) => {
              if (selectedItem) {
                setSelectedItem({ ...selectedItem, index: Number(e.target.value) });
              } else {
                setNewHistoryItem({ ...newHistoryItem, index: Number(e.target.value) });
              }
            }}
          />
          <Switch
            checked={selectedItem ? selectedItem.isCurrentlyVisible : newHistoryItem.isCurrentlyVisible}
            onChange={(e) => {
              if (selectedItem) {
                setSelectedItem({ ...selectedItem, isCurrentlyVisible: e.target.checked });
              } else {
                setNewHistoryItem({ ...newHistoryItem, isCurrentlyVisible: e.target.checked });
              }
            }}
            name="visible"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialogOpen(false);
              setSelectedItem(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HistoryManagementPage;
