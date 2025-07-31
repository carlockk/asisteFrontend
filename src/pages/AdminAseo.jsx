import { useEffect, useState } from 'react';
import {
  Box, TextField, Button, List, ListItem, IconButton, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

export default function AdminAseo({ usuario }) {
  const [items, setItems] = useState([]);
  const [nuevo, setNuevo] = useState('');
  const [editando, setEditando] = useState(null);

  const cargar = async () => {
    const res = await axios.get('/api/aseo');
    setItems(res.data);
  };

  useEffect(() => { cargar(); }, []);

  const guardar = async () => {
    if (!nuevo.trim()) return;
    if (editando) {
      await axios.put(`/api/aseo/${editando}`, { enunciado: nuevo });
    } else {
      await axios.post('/api/aseo', { enunciado: nuevo });
    }
    setNuevo('');
    setEditando(null);
    cargar();
  };

  const eliminar = async (id) => {
    if (usuario.rol !== 'admin') return alert('Solo el admin puede eliminar.');
    await axios.delete(`/api/aseo/${id}`);
    cargar();
  };

  return (
    <Box p={2}>
      <Typography variant="h6">Gestión de Checklist de Aseo</Typography>
      <TextField
        label="Nuevo ítem"
        fullWidth
        value={nuevo}
        onChange={(e) => setNuevo(e.target.value)}
        sx={{ my: 2 }}
      />
      <Button onClick={guardar} variant="contained">
        {editando ? 'Actualizar' : 'Agregar'}
      </Button>
      <List>
        {items.map(item => (
          <ListItem
            key={item._id}
            secondaryAction={
              <>
                <IconButton onClick={() => {
                  setNuevo(item.enunciado);
                  setEditando(item._id);
                }}>
                  <EditIcon />
                </IconButton>
                {usuario.rol === 'admin' && (
                  <IconButton onClick={() => eliminar(item._id)}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </>
            }
          >
            {item.enunciado}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
