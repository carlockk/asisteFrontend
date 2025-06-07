// src/components/CrearEmpleado.jsx
import React, { useState } from 'react';
import axios from 'axios';
import EmpleadoForm from './EmpleadoForm';
import { Box, Snackbar, Alert } from '@mui/material';

function CrearEmpleado() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    identityNumber: '',
    phone: '',
    email: '',
    photo: null,
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (updatedData) => {
    setFormData(updatedData);
  };

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      for (const key in formData) {
        if (formData[key]) {
          form.append(key, formData[key]);
        }
      }

      const res = await axios.post('http://localhost:3001/employees', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Empleado guardado:', res.data);
      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        identityNumber: '',
        phone: '',
        email: '',
        photo: null,
      });
    } catch (err) {
      console.error('Error al guardar:', err);
      setError('Error al guardar el empleado.');
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <EmpleadoForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} />

      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success" onClose={() => setSuccess(false)}>Empleado creado correctamente</Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}

export default CrearEmpleado;
