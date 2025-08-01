import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // 👈 importamos tu instancia de axios

function Login() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');

    if (!correo || !contraseña) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const res = await api.post('/auth/login', { correo, contraseña });

      // Guardar sesión
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.user));

      // Redirección según rol
      const { rol } = res.data.user;
      if (rol === 'admin') {
        navigate('/admin');
      } else if (rol === 'gestor') {
        navigate('/admin/aseo');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      const msg =
        err.response?.data?.error ||
        'Error de conexión con el servidor';
      setError(msg);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ backgroundColor: '#f9f9f9' }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Iniciar sesión
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Correo"
          fullWidth
          margin="normal"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          margin="normal"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Ingresar
        </Button>
      </Paper>
    </Box>
  );
}

export default Login;
