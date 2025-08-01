// src/pages/Employee.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';

function Employee() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [registradoHoy, setRegistradoHoy] = useState(false);

  useEffect(() => {
    const intervalo = setInterval(() => setFecha(new Date()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const marcarEntrada = async () => {
    setLoading(true);
    setMensaje('');

    try {
      const res = await fetch('http://localhost:3001/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employeeId: usuario.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar');

      setMensaje('✅ Entrada registrada correctamente');
      setRegistradoHoy(true);
    } catch (err) {
      setMensaje(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const marcarSalida = async () => {
    setLoading(true);
    setMensaje('');

    try {
      const res = await fetch('http://localhost:3001/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employeeId: usuario.id, checkOut: new Date() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al registrar salida');

      setMensaje('✅ Salida registrada correctamente');
    } catch (err) {
      setMensaje(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} textAlign="center">
      <Typography variant="h4" mb={2}>
        Bienvenido, {usuario.nombre}
      </Typography>

      <Typography variant="h6" color="text.secondary" mb={3}>
        {fecha.toLocaleTimeString()} - {fecha.toLocaleDateString()}
      </Typography>

      {mensaje && <Alert severity={mensaje.includes('✅') ? 'success' : 'error'}>{mensaje}</Alert>}

      <Box mt={3}>
        <Button
          variant="contained"
          color="success"
          onClick={marcarEntrada}
          disabled={loading || registradoHoy}
          sx={{ mr: 2 }}
        >
          Marcar Entrada
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={marcarSalida}
          disabled={loading}
        >
          Marcar Salida
        </Button>
      </Box>

      {loading && (
        <Box mt={2}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}

export default Employee;
