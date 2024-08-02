'use client';

import * as React from 'react';
import { useState } from 'react';
import EditLayoutForm from '@/app/dashboard/app-layout/[id]/edit-layout/page';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import AddLayoutForm from '@/components/dashboard/app-layout/add-layout-form';
import LayoutList from '@/components/dashboard/app-layout/layout-list';

interface Route {
  name: string;
  path: string;
  icon: string;
  isCurrentlyUsed: boolean;
}

interface Layout {
  _id: string;
  name: string;
  routes: Route[];
  isCurrentlySet: boolean;
}

export default function Page(): React.JSX.Element {
  const [editLayoutOpen, setEditLayoutOpen] = useState<boolean>(false);
  const [addLayoutOpen, setAddLayoutOpen] = useState<boolean>(false);
  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const handleAddLayoutClick = () => {
    setAddLayoutOpen(true);
  };

  const handleEditLayoutClick = (layout: Layout) => {
    setSelectedLayout(layout);
    setEditLayoutOpen(true);
  };

  const handleUpdate = () => {
    // Increment refresh trigger to refresh the LayoutList
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">App Layout</Typography>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleAddLayoutClick}
          >
            Add
          </Button>
        </div>
      </Stack>
      <LayoutList onEditLayoutClick={handleEditLayoutClick} refreshTrigger={refreshTrigger} />

      <AddLayoutForm
        open={addLayoutOpen}
        onClose={() => {
          setAddLayoutOpen(false);
        }}
        onAdd={handleUpdate}
      />
    </Stack>
  );
}
