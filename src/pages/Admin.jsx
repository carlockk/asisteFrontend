import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Modal, Button, Box } from '@mui/material';
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
    { field: 'email', headerName: 'Correo', width: 180 }
  ];

  return (
    <div>
      <h2>Admin</h2>
      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
  Crear Empleado
</Button>

      <div style={{ height: 400, width: '100%', marginTop: 20 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          onRowClick={(params) => {
            setSelected(params.row);
            setOpenView(true);
          }}
        />
      </div>

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
    </div>
  );
}

export default Admin;
