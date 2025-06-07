import React, { useState, useEffect } from 'react';
import {
  DataGrid
} from '@mui/x-data-grid';
import {
  Modal, Button, Box, Typography
} from '@mui/material';
import EmpleadoForm from '../components/EmpleadoForm';

function Admin() {
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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/employees`)
      .then(res => res.json())
      .then(setRows)
      .catch(() => setRows([]));
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
      field: 'historial',
      headerName: 'Historial',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => window.location.href = `/historial/${params.row._id}`}
        >
          Ver Historial
        </Button>
      )
    }
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Admin</Typography>
      <Button variant="contained" onClick={() => setOpenCreate(true)}>
        Crear Empleado
      </Button>

      <Box mt={3} style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          onRowClick={(params) => {
            setSelected(params.row);
            setOpenView(true);
          }}
        />
      </Box>

      <Modal open={openView} onClose={() => setOpenView(false)}>
        <Box sx={{ background: '#fff', padding: 3, margin: '10% auto', maxWidth: 400 }}>
          {selected && (
            <>
              <h3>{selected.firstName} {selected.lastName}</h3>
              <p>ID: {selected.identityNumber}</p>
              <p>Tel: {selected.phone}</p>
              <p>Email: {selected.email}</p>
            </>
          )}
        </Box>
      </Modal>

      <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
        <Box sx={{ background: '#fff', padding: 3, margin: '10% auto', maxWidth: 400 }}>
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
