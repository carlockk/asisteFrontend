import React from 'react';
import {
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';

function EmpleadoForm({ formData, onChange, onSubmit }) {
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    onChange({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  return (
    <Box component="form" noValidate>
      <Typography variant="h6" gutterBottom>
        Nuevo Empleado
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Nombre"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Apellido"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Identificación"
        name="identityNumber"
        value={formData.identityNumber}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Teléfono"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Correo"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <Button
        component="label"
        variant="outlined"
        sx={{ mt: 2 }}
      >
        Subir Foto (opcional)
        <input
          type="file"
          name="photo"
          hidden
          accept="image/*"
          onChange={handleChange}
        />
      </Button>

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        onClick={onSubmit}
      >
        Guardar Empleado
      </Button>
    </Box>
  );
}

export default EmpleadoForm;
