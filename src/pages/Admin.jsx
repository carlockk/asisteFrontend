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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import { Edit, Delete, History } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Admin() {
  const [empleados, setEmpleados] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [modo, setModo] = useState('crear');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // 🔁 Para redireccionar al historial

  const cargarEmpleados = async () => {
    try {
      const res = await api.get('/employees');
      setEmpleados(res.data);
    } catch (err) {
      console.error('Error al cargar empleados:', err);
      setMensaje('❌ No se pudo cargar la lista de empleados');
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const handleOpen = (empleado = {}) => {
    setForm(empleado);
    setModo(empleado._id ? 'editar' : 'crear');
    setOpen(true);
  };

  const handleClose = () => {
    setForm({});
    setOpen(false);
  };

  const guardar = async () => {
    setLoading(true);
    setMensaje('');

    try {
      if (modo === 'crear') {
        await api.post('/employees', form);
      } else {
        await api.put(`/employees/${form._id}`, form);
      }

      await cargarEmpleados();
      setMensaje('✅ Guardado correctamente');
      handleClose();
    } catch (err) {
      console.error('Error al guardar:', err);
      setMensaje('❌ Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este empleado?')) return;

    try {
      await api.delete(`/employees/${id}`);
      await cargarEmpleados();
    } catch (err) {
      console.error('Error al eliminar:', err);
      setMensaje('❌ Error al eliminar');
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>Panel de Administración</Typography>

      <Button variant="contained" onClick={() => handleOpen()}>+ Agregar empleado</Button>

      {mensaje && <Alert severity={mensaje.includes('✅') ? 'success' : 'error'} sx={{ mt: 2 }}>{mensaje}</Alert>}

      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Teléfono</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {empleados.map((emp) => (
            <TableRow key={emp._id}>
              <TableCell>{emp.firstName} {emp.lastName}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.phone}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleOpen(emp)}><Edit /></IconButton>
                <IconButton onClick={() => eliminar(emp._id)}><Delete /></IconButton>
                <IconButton
                  onClick={() => navigate(`/historial/${emp._id}`)}
                  color="primary"
                  title="Ver Historial"
                >
                  <History />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{modo === 'crear' ? 'Crear Empleado' : 'Editar Empleado'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            margin="dense"
            value={form.firstName || ''}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          <TextField
            label="Apellido"
            fullWidth
            margin="dense"
            value={form.lastName || ''}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          <TextField
            label="Correo"
            fullWidth
            margin="dense"
            value={form.email || ''}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Teléfono"
            fullWidth
            margin="dense"
            value={form.phone || ''}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={guardar} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Admin;
