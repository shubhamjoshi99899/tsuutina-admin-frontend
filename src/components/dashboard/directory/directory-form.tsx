import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

interface DirectoryFormProps {
  initialData?: {
    name: string;
    address: string;
    phone: string;
    website: string;
    hours: string;
    iframe: string;
  };
  onSubmit: (data: {
    name: string;
    address: string;
    phone: string;
    website: string;
    hours: string;
    iframe: string;
  }) => void;
}

const DirectoryForm: React.FC<DirectoryFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    website: '',
    hours: '',
    iframe: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Directory Form
      </Typography>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Website"
        name="website"
        value={formData.website}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Hours"
        name="hours"
        value={formData.hours}
        onChange={handleChange}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Iframe"
        name="iframe"
        value={formData.iframe}
        onChange={handleChange}
        fullWidth
        required
        multiline
        rows={4}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" type="submit">
        Save
      </Button>
    </Box>
  );
};

export default DirectoryForm;
