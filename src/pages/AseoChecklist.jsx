import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Autocomplete,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AseoChecklist() {
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [items, setItems] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [observaciones, setObservaciones] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Cargar ítems e usuarios con rol=empleado
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [itemsRes, empleadosRes] = await Promise.all([
          api.get('/api/aseo'),
          api.get('/api/usuarios?rol=empleado'),
        ]);
        setItems(itemsRes.data);
        setEmpleados(empleadosRes.data);
      } catch (err) {
        console.error('❌ Error al cargar datos:', err);
        setError('No se pudo cargar ítems o empleados.');
      }
    };

    cargarDatos();
  }, []);

  const handleRespuesta = (itemId, cumple) => {
    setRespuestas((prev) => ({ ...prev, [itemId]: cumple }));
  };

  const handleEnviar = async () => {
    setMensaje('');
    setError('');

    if (!empleadoSeleccionado) {
      setError('Debes seleccionar un empleado.');
      return;
    }

    if (Object.keys(respuestas).length < items.length) {
      setError('Debes responder todos los ítems.');
      return;
    }

    const datos = {
      empleado: empleadoSeleccionado._id,
      fecha: new Date().toISOString(),
      items: Object.entries(respuestas).map(([itemId, cumple]) => ({
        itemId,
        cumple,
      })),
      observaciones,
    };

    try {
      await api.post('/api/aseo/checklist', datos);
      setMensaje('✅ Checklist enviado correctamente.');
      setEmpleadoSeleccionado(null);
      setRespuestas({});
      setObservaciones('');
    } catch (err) {
      console.error('❌ Error al enviar checklist:', err);
      setError('Hubo un error al enviar el checklist.');
    }
  };

  useEffect(() => {
    if (mensaje || error) {
      const timeout = setTimeout(() => {
        setMensaje('');
        setError('');
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [mensaje, error]);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Bienvenido Administrador</Typography>
      <Typography variant="subtitle1" mb={3}>Checklist de Aseo Personal</Typography>

      {mensaje && <Alert severity="success">{mensaje}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Autocomplete
          options={empleados}
          getOptionLabel={(option) => option.nombre}
          value={empleadoSeleccionado}
          onChange={(event, newValue) => setEmpleadoSeleccionado(newValue)}
          renderInput={(params) => <TextField {...params} label="Seleccionar empleado" />}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Observaciones (opcional)"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          multiline
          rows={3}
        />
      </Paper>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>Ítems de Aseo</Typography>
        {items.map((item) => (
          <Box
            key={item._id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              p: 2,
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <Typography>{item.enunciado}</Typography>
            <Box>
              <Button
                variant={respuestas[item._id] === true ? 'contained' : 'outlined'}
                color="success"
                onClick={() => handleRespuesta(item._id, true)}
              >
                ✅ Sí
              </Button>
              <Button
                variant={respuestas[item._id] === false ? 'contained' : 'outlined'}
                color="error"
                sx={{ ml: 1 }}
                onClick={() => handleRespuesta(item._id, false)}
              >
                ❌ No
              </Button>
            </Box>
          </Box>
        ))}
      </Paper>

      <Button variant="contained" color="primary" onClick={handleEnviar}>
        Enviar Checklist
      </Button>
    </Box>
  );
}
