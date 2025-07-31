import { useState } from 'react';
import {
  Box, Button, TextField, Typography, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      const rol = res.data.usuario.rol;
      if (rol === 'admin') navigate('/admin');
      else if (rol === 'gestor') navigate('/admin/aseo');
      else navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <Box maxWidth={400} mx="auto" mt={10} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={2}>Iniciar Sesión</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        fullWidth
        label="Correo"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Contraseña"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <Button fullWidth variant="contained" onClick={handleLogin}>Ingresar</Button>
    </Box>
  );
}
