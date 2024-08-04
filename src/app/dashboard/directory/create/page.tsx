'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api-service';
import { Container, Typography } from '@mui/material';

import DirectoryForm from '@/components/dashboard/directory/directory-form';

function CreateDirectoryPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);

  const handleCreate = async (data: {
    name: string;
    address: string;
    email: string;
    phoneNumber: string;
    website: string;
    hours: string;
    iframe: string;
  }) => {
    try {
      const response = await apiService.createDirectoryItem(data);
      if (response.data) {
        router.push('/dashboard/directory');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Create Directory
      </Typography>
      {error ? <Typography color="error">{error}</Typography> : null}
      <DirectoryForm onSubmit={(data: any) => handleCreate(data)} />
    </Container>
  );
}

export default CreateDirectoryPage;
