import React from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box
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
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Nuevo Empleado
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth label="Nombre" name="firstName"
            value={formData.firstName} onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth label="Apellido" name="lastName"
            value={formData.lastName} onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth label="Identificación" name="identityNumber"
            value={formData.identityNumber} onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth label="Teléfono" name="phone"
            value={formData.phone} onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth label="Correo electrónico" name="email"
            value={formData.email} onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button component="label" variant="outlined" fullWidth>
            Subir Foto (opcional)
            <input hidden type="file" name="photo" accept="image/*" onChange={handleChange} />
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={onSubmit}
          >
            Guardar Empleado
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default EmpleadoForm;
