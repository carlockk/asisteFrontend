import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Modal,
  Paper
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EmpleadoForm from '../components/EmpleadoForm';

function Admin() {
  const [rows, setRows] = useState([]);
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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/employees`)
      .then(res => res.json())
      .then(setRows);
  }, []);

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
    { field: 'firstName', headerName: 'Nombre', width: 130 },
    { field: 'lastName', headerName: 'Apellido', width: 130 },
    { field: 'identityNumber', headerName: 'ID', width: 100 },
    { field: 'phone', headerName: 'Teléfono', width: 130 },
    { field: 'email', headerName: 'Correo', width: 180 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 160,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() =>
            window.location.href = `/historial/${params.row._id}`
          }
        >
          Ver Historial
        </Button>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Admin</Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Crear Empleado
        </Button>
      </Box>

      <Paper elevation={3} sx={{ height: 400 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          onRowClick={(params) => setSelected(params.row)}
          pageSize={100}
        />
      </Paper>

      <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
        <Box sx={{
          background: '#fff',
          padding: 3,
          margin: '5% auto',
          maxWidth: 500,
          borderRadius: 2
        }}>
          <EmpleadoForm
            formData={newEmp}
            onChange={setNewEmp}
            onSubmit={handleCreate}
          />
        </Box>
      </Modal>
    </Box>
  );
}

export default Admin;
