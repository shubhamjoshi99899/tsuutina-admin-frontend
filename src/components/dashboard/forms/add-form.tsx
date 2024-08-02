import React, { useState } from 'react';
import apiService from '@/services/api-service';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';

interface AddFormProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}

const AddForm: React.FC<AddFormProps> = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState({ title: '', description: '', fields: [], isActive: true });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    apiService.createForm(form).then(() => {
      onAdd();
      onClose();
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Form</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField label="Title" name="title" value={form.title} onChange={handleChange} />
          <TextField label="Description" name="description" value={form.description} onChange={handleChange} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddForm;
