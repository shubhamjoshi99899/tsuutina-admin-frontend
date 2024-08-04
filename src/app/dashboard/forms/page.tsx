'use client';

import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Container, Grid, Stack, Typography } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react';
import Swal from 'sweetalert2'
import AddForm from '@/components/dashboard/forms/add-form';
import EditForm from '@/components/dashboard/forms/edit-form';
import FormList from '@/components/dashboard/forms/form-list';
import ViewResponses from '@/components/dashboard/forms/view-response';
import apiService from '@/services/api-service';
import { useRouter } from 'next/navigation';

export default function ManageForms(): React.JSX.Element {
  const [editFormOpen, setEditFormOpen] = useState<boolean>(false);
  const [addFormOpen, setAddFormOpen] = useState<boolean>(false);
  const [viewResponsesOpen, setViewResponsesOpen] = useState<boolean>(false);
  const [selectedForm, setSelectedForm] = useState<any | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [forms, setForms] = useState<any[]>([]);
  const [currentForm, setCurrentForm] = useState<any | null>(null);
const [responseCounts, setResponseCounts] = useState<Record<string, number>>({});

  const router = useRouter();
  const handleAddFormClick = () => {
    router.push('/dashboard/forms/add');
  };

  const fetchForms = async () => {
    await apiService.getForms().then((response) => {
        setForms(response.data.data);
    });
  };

  const handleEditFormClick = (form: any) => {
    router.push(`/dashboard/forms/${form._id}/edit`);
  }

  const handleViewResponsesClick = (form: any) => {
    setSelectedForm(form);
    setViewResponsesOpen(true);
  };

  const handlePreviewFormClick = (form: any) => {
    router.push(`/dashboard/forms/${form._id}/preview`);
  }

  const handleUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleViewResponse = (form:any) =>[
router.push(`/dashboard/forms/${form._id}/response`),
  ]

  const FetchResponseCountByFormId = (formId: string) =>
    apiService.fetchCountByFormId(formId).then((response) => {
      if (response && response.data) {
        return response.data.data;
      }
      return 0;
    });

    useEffect(() => {
      fetchForms();
    }, []);
  

    useEffect(()=>{
      if(currentForm) {
        try{
          apiService.setFormAsCurrent(currentForm);
          Swal.fire({
            title: "Success!",
            text: "Selected form Set as current form!",
            icon: "success"
          });
          fetchForms();
        }
        catch(err:any) {
          Swal.fire({
            title: "Error!",
            text: err.message,
            icon: "error"
          });
        }
      }
    },[currentForm]);

useEffect(() => {
  forms.forEach(form => {
    FetchResponseCountByFormId(form._id).then(count => {
      setResponseCounts(prev => ({ ...prev, [form._id]: count }));
    });
  });
}, [forms]);


    
  useEffect(() => {
    fetchForms();
  }, []);

  console.log(responseCounts)


  return (
    <Container maxWidth="xl">
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }} mb={2}>
          <Typography variant="h4">Manage Forms</Typography>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleAddFormClick}
          >
            Add
          </Button>
        </div>
      </Stack>
      <Grid container spacing={3}>
        {forms?.map((form) => (
          <Grid  key ={form._id} item xs={12} md={6} lg={12}>
            <Card sx={{border: form.isActive ? '1px solid green' : 'none', background: form.isActive ? '#F5FFFA' : '#FFF0F5'}}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                  <Typography variant="h6">{form.title}</Typography>
                  <Typography variant="body2">{form.description}</Typography>
                  <Typography variant="body2"><span style={{color:'black'}}>Total Response {responseCounts[form._id]}</span></Typography>

                  </Box>

                  <Button title='View Response' variant='contained' onClick={()=>handleViewResponse(form)}>
                    View Response
                  </Button>
                </Stack>
    
                <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" disabled={form.isActive===true} onClick={() => { setCurrentForm(form._id); }} sx={{ mt: 2 }}>
                Set as Current
              </Button>
              <Button variant="contained" color="primary" onClick={() =>{handleEditFormClick(form)}} sx={{ mt: 2 }}>
                Edit
              </Button>
              <Button variant="contained" color="primary" onClick={() => { handlePreviewFormClick(form); }} sx={{ mt: 2 }}>
                Preview
              </Button>
              </Stack>
              </CardContent>
            </Card>
            </Grid>
        ))}
     
      </Grid>
      {selectedForm ? <EditForm
          open={editFormOpen}
          onClose={() => {
            setEditFormOpen(false);
          }}
          form={selectedForm}
          onUpdate={handleUpdate}
        /> : null}
    </Container>
  );
}
