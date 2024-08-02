import React, { useEffect, useState } from 'react';
import apiService, { Form } from '@/services/api-service';
import { Button, Card, Grid, Stack, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface FormListProps {
  onEditFormClick: (form: Form) => void;
  refreshTrigger: number;
}

export function FormList({ onEditFormClick, refreshTrigger }: FormListProps): React.JSX.Element {
  const [forms, setForms] = useState<Form[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fetchForms = async (): Promise<any> => {
    try {
      const response = await apiService.getForms();
      setForms(response.data.data);
    } catch (err: any) {
      setError(err.message);
    }
  };
  useEffect(() => {
    fetchForms();
  }, [refreshTrigger]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <Grid container>
        {forms?.map((form) => (
          <Grid key={form._id} item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5">{form.title}</Typography>
              <Typography>{form?.description}</Typography>
              <Typography mb={2}>Fields: {form?.fields?.map((field) => field.label).join(', ')}</Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    onEditFormClick(form);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    onEditFormClick(form);
                  }}
                >
                  View responses
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default FormList;
