import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Checkbox, FormControlLabel, MenuItem, IconButton, Box } from '@mui/material';
import { Add, Delete, Remove } from '@mui/icons-material';
import apiService from '@/services/api-service';
import { useRouter } from 'next/navigation';

interface Field {
  label: string;
  type: string;
  options: string[];
  required: boolean;
  isActive: boolean;
}

interface Form {
  title: string;
  description: string;
  fields: Field[];
  isActive: boolean;
}

const AddFormComponent: React.FC = () => {
  const [form, setForm] = useState<Form>({
    title: '',
    description: '',
    fields: [],
    isActive: true,
  });
  const router = useRouter();

  const handleFieldChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFields = [...form.fields];
    const { name, value, type } = event.target;
  
    if (type === 'checkbox') {
      const checked = (event.target as HTMLInputElement).checked;
      newFields[index] = { ...newFields[index], [name]: checked };
    } else {
      newFields[index] = { ...newFields[index], [name]: value };
    }
  
    setForm({ ...form, fields: newFields });
  };

  const handleOptionChange = (fieldIndex: number, optionIndex: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFields = [...form.fields];
    newFields[fieldIndex].options[optionIndex] = event.target.value;
    setForm({ ...form, fields: newFields });
  };

  const addField = () => {
    setForm({
      ...form,
      fields: [
        ...form.fields,
        { label: '', type: 'text', options: [], required: true, isActive: true },
      ],
    });
  };

  const removeField = (index: number) => {
    const newFields = form.fields.filter((_, i) => i !== index);
    setForm({ ...form, fields: newFields });
  };

  const addOption = (index: number) => {
    const newFields = [...form.fields];
    newFields[index].options.push('');
    setForm({ ...form, fields: newFields });
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const newFields = [...form.fields];
    newFields[fieldIndex].options = newFields[fieldIndex].options.filter((_, i) => i !== optionIndex);
    setForm({ ...form, fields: newFields });
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await apiService.createForm(form);
    if(result.data.success === true){
      alert("Form created successfully");
      router.push("/dashboard/forms");
    }
    console.log(form);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleFormChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleFormChange}
          fullWidth
          required
          margin="normal"
        />
        {form.fields.map((field, index) => (
          <Box key={index} display="flex" flexDirection="column" marginBottom={2}>
            <Box display="flex" alignItems="center">
              <TextField
                label="Label"
                name="label"
                value={field.label}
                onChange={(event) => handleFieldChange(index, event)}
                margin="normal"
                required
              />
              <TextField
                label="Type"
                name="type"
                value={field.type}
                onChange={(event) => handleFieldChange(index, event)}
                margin="normal"
                select
                required
                style={{ marginLeft: '1rem' }}
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="select">Select</MenuItem>
                <MenuItem value="checkbox">Checkbox</MenuItem>
                <MenuItem value="email">Email</MenuItem>
              </TextField>
              
              <IconButton onClick={() => removeField(index)} style={{ marginLeft: '1rem' }}>
                <Delete color="error" />
              </IconButton>
            </Box>
            {field.type === 'select' && (
              <Box marginLeft="2rem">
                {field.options.map((option, optionIndex) => (
                  <Box key={optionIndex} display="flex" alignItems="center" marginBottom={1}>
                    <TextField
                      label={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(event) => handleOptionChange(index, optionIndex, event)}
                      margin="normal"
                      required
                    />
                    <IconButton onClick={() => removeOption(index, optionIndex)}>
                      <Remove />
                    </IconButton>
                  </Box>
                ))}
                <Button variant="contained" color="primary" onClick={() => addOption(index)} startIcon={<Add />}>
                  Add Option
                </Button>
              </Box>
            )}
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={addField} startIcon={<Add />}>
          Add Field
        </Button>
        <Button type="submit" variant="contained" color="secondary" fullWidth style={{ marginTop: '1rem' }}>
          Save Form
        </Button>
      </form>
    </Container>
  );
};

export default AddFormComponent ;