'use client';

import React, { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import apiService from '@/services/api-service';
import { Box, Button, Card, FormControlLabel, Switch, Typography } from '@mui/material';
import type { AxiosResponse } from 'axios';

interface Route {
  _id?: string;
  name: string;
  path: string;
  icon: string;
  isCurrentlyUsed: boolean;
}

interface Layout {
  _id?: string;
  name: string;
  routes: Route[];
  isCurrentlySet: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export default function LayoutDetails(): React.JSX.Element {
  const router = useRouter();
  const { id } = useParams();
  const [layout, setLayout] = useState<Layout | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggleRouteUsage = async (isCurrentlyUsed: boolean, layout_id?: string, route_id?: string) => {
    if (route_id && layout_id) {
      try {
        const response = await apiService.updateLayoutRoute(layout_id, route_id, { isCurrentlyUsed: isCurrentlyUsed });
        if (response.data.success) {
          setLayout((prevLayout) => {
            if (!prevLayout) return prevLayout;
            const updatedRoutes = prevLayout.routes.map((route) =>
              route._id === route_id ? { ...route, isCurrentlyUsed } : route
            );
            return { ...prevLayout, routes: updatedRoutes };
          });
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    }
  };

  const fetchLayout = async (id: string) => {
    if (id) {
      apiService
        .getLayoutById(id as string)
        .then((response: AxiosResponse<ApiResponse<Layout>>) => {
          setLayout(response.data.data);
        })
        .catch((err) => {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred');
          }
        });
    }
  };

  useEffect(() => {
    fetchLayout(id as string);
  }, [id]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!layout) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {layout.name}
      </Typography>
      {layout.routes.map((route) => (
        <Card key={route._id} sx={{ p: 2, mb: 2 }}>
          <Typography fontWeight={700}>{route.name}</Typography>
          <Typography>{route.path}</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={route.isCurrentlyUsed}
                onChange={(e) => handleToggleRouteUsage(e.target.checked, layout?._id, route?._id)}
              />
            }
            label="Currently Used"
          />
        </Card>
      ))}
      <Button variant="contained" color="primary" onClick={() => router.back()}>
        Back
      </Button>
    </Box>
  );
}
