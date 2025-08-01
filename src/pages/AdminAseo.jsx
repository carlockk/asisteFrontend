import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  Alert
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import api from '../api/axios';

function AdminAseo() {
  const [itemsChecklist, setItemsChecklist] = useState([]);
  const [nuevoItem, setNuevoItem] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarItemsChecklist = async () => {
    try {
      const res = await api.get('/api/aseo/items');
      setItemsChecklist(res.data);
    } catch (err) {
      console.error('Error al cargar ítems del checklist:', err);
      setMensaje('❌ No autorizado para cargar ítems');
    }
  };

  useEffect(() => {
    cargarItemsChecklist();
  }, []);

  const agregarItemChecklist = async () => {
    if (!nuevoItem.trim()) return;
    try {
      await api.post('/api/aseo', { enunciado: nuevoItem });
      setNuevoItem('');
      await cargarItemsChecklist();
      setMensaje('✅ Ítem agregado');
    } catch (err) {
      console.error('Error al agregar ítem:', err);
      setMensaje('❌ No autorizado para agregar ítem');
    }
  };

  const eliminarItemChecklist = async (id) => {
    try {
      await api.delete(`/api/aseo/${id}`);
      await cargarItemsChecklist();
      setMensaje('✅ Ítem eliminado');
    } catch (err) {
      console.error('Error al eliminar ítem:', err);
      setMensaje('❌ No autorizado para eliminar ítem');
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>
        Checklist de Aseo Personal
      </Typography>

      {mensaje && (
        <Alert severity={mensaje.includes('✅') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {mensaje}
        </Alert>
      )}

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Nuevo ítem"
          value={nuevoItem}
          onChange={(e) => setNuevoItem(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={agregarItemChecklist}>
          Agregar ítem
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ítem</TableCell>
            <TableCell>Eliminar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {itemsChecklist.map((item) => (
            <TableRow key={item._id}>
              <TableCell>{item.enunciado}</TableCell>
              <TableCell>
                <IconButton onClick={() => eliminarItemChecklist(item._id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default AdminAseo;
