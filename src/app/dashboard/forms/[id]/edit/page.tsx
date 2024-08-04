"use client";
import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  IconButton,
  Box,
  Checkbox,
  InputLabel,
  MenuItem,
  Grid,
  Typography,
} from '@mui/material';
import { Add, Delete, Remove } from '@mui/icons-material';
import apiService from '@/services/api-service';
import { useParams, useRouter } from 'next/navigation';
import { Stack } from '@mui/system';

interface Field {
  label: string;
  type: string;
  options?: string[];
  required: boolean;
  isActive: boolean;
}

interface Form {
  title: string;
  description: string;
  fields: Field[];
  isActive: boolean;
}

function EditForm(): React.JSX.Element {
  const params = useParams();
  const [form, setForm] = useState<Form>({} as Form);
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      apiService.getFormById(id).then((response) => {
        if (response && response.data) {
          setForm(response.data.data);
        }
      });
    }
  }, [id]);

  const handleFieldChange = (index: number, field: keyof Field, value: any) => {
    if (form) {
      const newFields = [...form.fields];
      newFields[index] = { ...newFields[index], [field]: value };
      setForm({ ...form, fields: newFields });
    }
  };

  const handleAddField = () => {
    if (form) {
      setForm({
        ...form,
        fields: [
          ...form.fields,
          { label: '', type: 'text', options: [], required: false, isActive: true },
        ],
      });
    }
  };

  const handleRemoveField = (index: number) => {
    if (form) {
      const newFields = form.fields.filter((_, i) => i !== index);
      setForm({ ...form, fields: newFields });
    }
  };

  const addOption = (index: number) => {
    const newFields = [...form.fields];
    newFields[index].options = [...(newFields[index].options || []), ''];
    setForm({ ...form, fields: newFields });
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const newFields = [...form.fields];
    newFields[fieldIndex].options = newFields[fieldIndex].options?.filter((_, i) => i !== optionIndex);
    setForm({ ...form, fields: newFields });
  };

  const handleOptionChange = (fieldIndex: number, optionIndex: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFields = [...form.fields];
    if (newFields[fieldIndex].options) {
      newFields[fieldIndex].options[optionIndex] = event.target.value;
      setForm({ ...form, fields: newFields });
    }
  };

  const handleSubmit = async () => {
    if (form) {
      console.log(form)
      await apiService.updateForm(id, form);
      router.push('/dashboard/forms')
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div>
      <Container>
        <InputLabel>Title</InputLabel>
        <TextField
          value={form.title}
          onChange={(e) => { setForm({ ...form, title: e.target.value }); }}
          fullWidth
          margin="normal"
        />
        <InputLabel>Description</InputLabel>
        <TextField
          value={form.description}
          onChange={(e) => { setForm({ ...form, description: e.target.value }); }}
          fullWidth
          margin="normal"
        />
        <Typography my={2} variant="h6">Fields</Typography>
        {form?.fields?.map((field, index) => (
          <Box key={index} marginY={1} sx={{ border: '1px solid #ccc', borderRadius: '5px', p: 2 }}>
            <Grid container spacing={2} alignItems="baseline">
              <Grid item xs={12} md={3}>
                <InputLabel>Label</InputLabel>
                <TextField
                  value={field.label}
                  onChange={(e) => { handleFieldChange(index, 'label', e.target.value); }}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Box>
                  <InputLabel>Type</InputLabel>
                  <TextField
                    name="type"
                    value={field.type}
                    onChange={(e) => { handleFieldChange(index, 'type', e.target.value); }}
                    margin="normal"
                    select
                    fullWidth
                    required
                    style={{ marginLeft: '1rem' }}
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="select">Select</MenuItem>
                    <MenuItem value="checkbox">Checkbox</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                  </TextField>
                </Box>
                {field.type === 'select'  || field.type === 'checkbox' && (
                  <Box marginLeft="1rem">
                    {field.options?.map((option, optionIndex) => (
                      <Box key={optionIndex} display="flex" alignItems="center" marginBottom={1}>
                        <TextField
                          label={`Option ${optionIndex + 1}`}
                          value={option}
                          onChange={(event) => { handleOptionChange(index, optionIndex, event); }}
                          margin="normal"
                          required
                        />
                        <IconButton onClick={() => { removeOption(index, optionIndex); }}>
                          <Remove />
                        </IconButton>
                      </Box>
                    ))}
                    <Button variant="contained" color="primary" onClick={() => { addOption(index); }} startIcon={<Add />}>
                      Add Option
                    </Button>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={2}>
                <InputLabel sx={{ ml:2 }}>Required</InputLabel>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.required}
                      onChange={(e) =>
                        { handleFieldChange(index, 'required', e.target.checked); }
                      }
                      sx={{ ml: 2, p: 4 }}
                    />
                  }
                  label="Required"
                />
              </Grid>
              <Grid item xs={12} md={3} sx={{ ml:2, p:4 }}>
                <InputLabel>Active</InputLabel>
                <RadioGroup
                  row
                  value={field.isActive ? 'active' : 'inactive'}
                  onChange={(e) =>
                    { handleFieldChange(index, 'isActive', e.target.value === 'active'); }
                  }
                  sx={{ ml: 2, p: 4 }}
                >
                  <FormControlLabel
                    value="active"
                    control={<Radio />}
                    label="Active"
                  />
                  <FormControlLabel
                    value="inactive"
                    control={<Radio />}
                    label="Inactive"
                  />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} md={1} display="flex" justifyContent="center" alignItems="center">
                <Typography>Delete</Typography>
                <IconButton onClick={() => { handleRemoveField(index); }}>
                  <Delete color='error' />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Stack direction="row" spacing={2}>
          <Button onClick={handleAddField} startIcon={<Add />}>
            Add Field
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Stack>
      </Container>
    </div>
  );
}

export default EditForm;
