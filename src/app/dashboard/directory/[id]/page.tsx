'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiService from '@/services/api-service';
import { Box, Button, Container, Typography } from '@mui/material';

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

const DirectoryDetailsPage = (): React.JSX.Element => {
  const router = useRouter();
  const { id } = useParams();
  console.log(id);
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

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!directory) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {directory.name}
      </Typography>
      <Typography variant="body1">Address: {directory.address}</Typography>
      <Typography variant="body1">Phone: {directory.phoneNumber}</Typography>
      <Typography variant="body1">
        Website:{' '}
        <a href={`http://${directory.website}`} target="_blank" rel="noopener noreferrer">
          {directory.website}
        </a>
      </Typography>
      <Typography variant="body1">Hours: {directory.hours}</Typography>
      <Box sx={{ mt: 2 }}>
        <div dangerouslySetInnerHTML={{ __html: directory.iframe }} />
      </Box>
      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={() => router.push(`/dashboard/directory/edit/${directory._id}`)}
      >
        Edit
      </Button>
    </Container>
  );
};

export default DirectoryDetailsPage;
