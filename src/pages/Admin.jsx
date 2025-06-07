import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  Paper,
  useTheme,
  Container
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EmpleadoForm from '../components/EmpleadoForm';

function Admin() {
  const theme = useTheme();

  const [rows, setRows] = useState([]);
  const [openView, setOpenView] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [selected, setSelected] = useState(null);
  const [newEmp, setNewEmp] = useState({
    firstName: '',
    lastName: '',
    identityNumber: '',
    phone: '',
    email: '',
    photo: null
  });

  // 🔁 Cargar empleados
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/employees`)
      .then(res => res.json())
      .then(setRows)
      .catch(err => console.error("Error cargando empleados:", err));
  }, []);

  // ✅ Crear nuevo empleado
  const handleCreate = async () => {
    const formData = new FormData();
    for (const key in newEmp) {
      if (newEmp[key]) formData.append(key, newEmp[key]);
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/employees`, {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    setRows([...rows, data]);
    setOpenCreate(false);
    setNewEmp({
      firstName: '',
      lastName: '',
      identityNumber: '',
      phone: '',
      email: '',
      photo: null
    });
  };

  const columns = [
    { field: 'firstName', headerName: 'Nombre', flex: 1 },
    { field: 'lastName', headerName: 'Apellido', flex: 1 },
    { field: 'identityNumber', headerName: 'ID', flex: 0.5 },
    { field: 'phone', headerName: 'Teléfono', flex: 1 },
    { field: 'email', headerName: 'Correo', flex: 1.5 }
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Admin
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreate(true)}
        >
          Crear Empleado
        </Button>
      </Box>

      <Paper elevation={3} sx={{ height: 400 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          onRowClick={(params) => {
            setSelected(params.row);
            setOpenView(true);
          }}
          sx={{ border: 'none' }}
        />
      </Paper>

      {/* Modal Ver Empleado */}
      <Modal open={openView} onClose={() => setOpenView(false)}>
        <Box
          sx={{
            background: '#fff',
            p: 4,
            m: '10% auto',
            maxWidth: 400,
            borderRadius: 2
          }}
        >
          {selected && (
            <>
              <Typography variant="h6">
                {selected.firstName} {selected.lastName}
              </Typography>
              <Typography>ID: {selected.identityNumber}</Typography>
              <Typography>Tel: {selected.phone}</Typography>
              <Typography>Email: {selected.email}</Typography>
            </>
          )}
        </Box>
      </Modal>

      {/* Modal Crear Empleado */}
      <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
        <Box
          sx={{
            background: '#fff',
            p: 4,
            m: '5% auto',
            maxWidth: 500,
            borderRadius: 2
          }}
        >
          <EmpleadoForm
            formData={newEmp}
            onChange={setNewEmp}
            onSubmit={handleCreate}
          />
        </Box>
      </Modal>
    </Container>
  );
}

export default Admin;
