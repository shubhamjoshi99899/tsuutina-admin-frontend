'use client';

import React, { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { Plus as PlusIcon } from '@phosphor-icons/react';

import AddForm from '@/components/dashboard/forms/add-form';
import EditForm from '@/components/dashboard/forms/edit-form';
import FormList from '@/components/dashboard/forms/form-list';
import ViewResponses from '@/components/dashboard/forms/view-response';

export default function ManageForms(): React.JSX.Element {
  const [editFormOpen, setEditFormOpen] = useState<boolean>(false);
  const [addFormOpen, setAddFormOpen] = useState<boolean>(false);
  const [viewResponsesOpen, setViewResponsesOpen] = useState<boolean>(false);
  const [selectedForm, setSelectedForm] = useState<any | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleAddFormClick = () => {
    setAddFormOpen(true);
  };

  const handleEditFormClick = (form: any) => {
    setSelectedForm(form);
    setEditFormOpen(true);
  };

  const handleViewResponsesClick = (form: any) => {
    setSelectedForm(form);
    setViewResponsesOpen(true);
  };

  const handleUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
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
      <FormList onEditFormClick={handleEditFormClick} refreshTrigger={refreshTrigger} />
      {selectedForm && <ViewResponses formId={selectedForm._id!} />}
      <AddForm
        open={addFormOpen}
        onClose={() => {
          setAddFormOpen(false);
        }}
        onAdd={handleUpdate}
      />
      {selectedForm && (
        <EditForm
          open={editFormOpen}
          onClose={() => {
            setEditFormOpen(false);
          }}
          form={selectedForm}
          onUpdate={handleUpdate}
        />
      )}
    </Stack>
  );
}
