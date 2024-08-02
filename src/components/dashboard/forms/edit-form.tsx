import React, { useEffect, useState } from 'react';
import apiService, { Form } from '@/services/api-service';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';

interface EditFormProps {
  open: boolean;
  onClose: () => void;
  form: Form;
  onUpdate: () => void;
}

export function EditForm({ open, onClose, form, onUpdate }: EditFormProps): React.JSX.Element {
  const [editedForm, setEditedForm] = useState<Form>(form);

  useEffect(() => {
    setEditedForm(form);
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleFieldChange = (index: number, key: string, value: any) => {
    const updatedFields = editedForm.fields.map((field, i) => (i === index ? { ...field, [key]: value } : field));
    setEditedForm((prevForm) => ({ ...prevForm, fields: updatedFields }));
  };

  const handleAddField = () => {
    const newField = {
      label: '',
      type: 'text',
      options: [],
      required: false,
      isActive: true,
      _id: `${Date.now()}`, // Temporary ID until saved
    };
    setEditedForm((prevForm) => ({
      ...prevForm,
      fields: [...prevForm.fields, newField],
    }));
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = editedForm.fields.filter((_, i) => i !== index);
    setEditedForm((prevForm) => ({ ...prevForm, fields: updatedFields }));
  };

  const handleUpdate = async () => {
    await apiService.updateForm(form._id!, editedForm).then(() => {
      onUpdate();
      onClose();
    });
  };

  const renderFieldInput = (field: any, index: number) => {
    return (
      <Stack direction="row" spacing={1} alignItems="center" key={field._id}>
        <TextField
          label="Label"
          name="label"
          value={field.label}
          onChange={(e) => {
            handleFieldChange(index, 'label', e.target.value);
          }}
        />
        <TextField
          select
          label="Type"
          name="type"
          value={field.type}
          onChange={(e) => {
            handleFieldChange(index, 'type', e.target.value);
          }}
        >
          <MenuItem value="text">Text</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="select">Select</MenuItem>
          <MenuItem value="textarea">Textarea</MenuItem>
        </TextField>
        {field.type === 'select' && (
          <TextField
            label="Options (comma-separated)"
            name="options"
            value={field.options.join(',')}
            onChange={(e) => {
              handleFieldChange(index, 'options', e.target.value.split(','));
            }}
          />
        )}
        <TextField
          label="Required"
          select
          name="required"
          value={field.required ? 'true' : 'false'}
          onChange={(e) => {
            handleFieldChange(index, 'required', e.target.value === 'true');
          }}
        >
          <MenuItem value="true">Yes</MenuItem>
          <MenuItem value="false">No</MenuItem>
        </TextField>
        <IconButton
          onClick={() => {
            handleRemoveField(index);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Form</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <TextField label="Title" name="title" value={editedForm.title} onChange={handleChange} />
          <TextField label="Description" name="description" value={editedForm.description} onChange={handleChange} />
          {editedForm.fields.map((field, index) => (
            <div key={field._id}>{renderFieldInput(field, index)}</div>
          ))}
          <Button variant="outlined" onClick={handleAddField}>
            Add Field
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleUpdate} variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditForm;
