// src/components/EmpleadoForm.jsx
import React from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

function EmpleadoForm({ formData, onChange, onSubmit }) {
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    onChange({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Nuevo Empleado</Typography>

      <TextField
        fullWidth label="Nombre" name="firstName" margin="normal"
        value={formData.firstName} onChange={handleChange}
      />

      <TextField
        fullWidth label="Apellido" name="lastName" margin="normal"
        value={formData.lastName} onChange={handleChange}
      />

      <TextField
        fullWidth label="Identificación" name="identityNumber" margin="normal"
        value={formData.identityNumber} onChange={handleChange}
      />

      <TextField
        fullWidth label="Teléfono" name="phone" margin="normal"
        value={formData.phone} onChange={handleChange}
      />

      <TextField
        fullWidth label="Correo" name="email" margin="normal"
        value={formData.email} onChange={handleChange}
      />

      <Button component="label" sx={{ mt: 2 }}>
        Subir Foto (opcional)
        <input hidden type="file" name="photo" accept="image/*" onChange={handleChange} />
      </Button>

      <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={onSubmit}>
        Guardar Empleado
      </Button>
    </Box>
  );
}

export default EmpleadoForm;
