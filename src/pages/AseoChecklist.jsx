import React from 'react';
import { useEffect, useState } from 'react';
import {
  Checkbox, FormControlLabel, TextField, Button, Typography, Box
} from '@mui/material';
import api from '../api/axios';

export default function AseoChecklist({ usuario }) {
  const [items, setItems] = useState([]);
  const [estado, setEstado] = useState({});
  const [observacion, setObservacion] = useState('');

  useEffect(() => {
    const cargarItems = async () => {
      const res = await api.get('/api/aseo', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setItems(res.data);
    };
    cargarItems();
  }, []);

  const handleCheck = (id) => {
    setEstado((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    console.log({
      usuario: usuario?.nombre || 'Empleado',
      itemsMarcados: estado,
      observacion,
      hora: new Date().toLocaleTimeString()
    });
    alert('Checklist enviado.');
  };

  return (
    <Box p={2}>
      <Typography variant="h5">Bienvenido {usuario?.nombre}</Typography>
      <Typography variant="subtitle1">Checklist de Aseo Personal</Typography>
      <Box mt={2}>
        {items.map(item => (
          <FormControlLabel
            key={item._id}
            control={
              <Checkbox
                checked={!!estado[item._id]}
                onChange={() => handleCheck(item._id)}
              />
            }
            label={item.enunciado}
          />
        ))}
        <TextField
          fullWidth
          label="Observaciones (opcional)"
          multiline
          rows={2}
          value={observacion}
          onChange={e => setObservacion(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
          Marcar Entrada / Salida
        </Button>
      </Box>
    </Box>
  );
}
