'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiService from '@/services/api-service';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

interface DirectoryItem {
  _id?: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  website: string;
  image?: string;
  hours: string;
  iframe: string;
}

function EditDirectoryPage(): React.JSX.Element {
  const router = useRouter();
  const { id } = useParams();
  const [directory, setDirectory] = useState<DirectoryItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchDirectory(id.toString());
    }
  }, [id]);

  const fetchDirectory = async (id: string) => {
    try {
      const response = await apiService.getDirectoryItemById(id);
      setDirectory(response.data.data);
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
      if (directory?._id) {
        await apiService.updateDirectoryItem(directory._id, directory);
        router.push(`/dashboard/directory`);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!directory) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Edit Directory
      </Typography>
      <TextField
        label="Name"
        fullWidth
        value={directory.name}
        onChange={(e) => { setDirectory({ ...directory, name: e.target.value }); }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Address"
        fullWidth
        value={directory.address}
        onChange={(e) => { setDirectory({ ...directory, address: e.target.value }); }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Phone"
        fullWidth
        value={directory.phoneNumber}
        onChange={(e) => { setDirectory({ ...directory, phoneNumber: e.target.value }); }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Website"
        fullWidth
        value={directory.website}
        onChange={(e) => { setDirectory({ ...directory, website: e.target.value }); }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Hours"
        fullWidth
        value={directory.hours}
        onChange={(e) => { setDirectory({ ...directory, hours: e.target.value }); }}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Iframe"
        fullWidth
        multiline
        rows={4}
        value={directory.iframe}
        onChange={(e) => { setDirectory({ ...directory, iframe: e.target.value }); }}
        sx={{ mb: 2 }}
      />
      <Box sx={{ mt: 2 }}>
        <div dangerouslySetInnerHTML={{ __html: directory.iframe }} />
      </Box>
      <Button variant="contained" sx={{ mt: 3 }} onClick={handleSave}>
        Save
      </Button>
    </Container>
  );
}

export default EditDirectoryPage;
