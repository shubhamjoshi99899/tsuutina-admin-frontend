'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api-service';
import { Box, Button, Card, Container, List, ListItem, Typography } from '@mui/material';

interface Directory {
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

const DirectoryListPage = () => {
  const router = useRouter();
  const [directories, setDirectories] = useState<Directory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDirectories();
  }, []);

  const fetchDirectories = async () => {
    try {
      const response = await apiService.getDirectoryItems();
      setDirectories(response.data.data);
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
      <Typography variant="h4" sx={{ mb: 3 }}>
        Directories
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push('/dashboard/directory/create')}
        sx={{ mb: 3 }}
      >
        Create New Directory
      </Button>
      <List>
        {directories.map((directory) => (
          <Card elevation={14} sx={{ p: 3 }} key={directory._id}>
            <ListItem>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{directory.name}</Typography>
                <Typography variant="body1">{directory.address}</Typography>
                <Typography variant="body1">{directory.phoneNumber}</Typography>
                <Typography variant="body1">{directory.website}</Typography>
                <Typography variant="body1">{directory.hours}</Typography>
              </Box>
              <Button variant="outlined" onClick={() => router.push(`/dashboard/directory/${directory._id}`)}>
                View / Edit
              </Button>
            </ListItem>
          </Card>
        ))}
      </List>
    </Container>
  );
};

export default DirectoryListPage;
