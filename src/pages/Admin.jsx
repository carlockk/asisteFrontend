import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Modal, Button, TextField } from '@mui/material';

function Admin() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/employees')
      .then(res => res.json())
      .then(setRows);
  }, []);

  const columns = [
    { field: 'firstName', headerName: 'Nombre', width: 130 },
    { field: 'lastName', headerName: 'Apellido', width: 130 },
    { field: 'checkIn', headerName: 'Hora Entrada', width: 180 },
    { field: 'checkOut', headerName: 'Hora Salida', width: 180 },
    { field: 'total', headerName: 'Horas del Dia', width: 150 },
  ];

  return (
    <div>
      <h2>Admin</h2>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={columns} getRowId={(row) => row._id} onRowClick={(params)=>{setSelected(params.row);setOpen(true);}}/>
      </div>
      <Modal open={open} onClose={()=>setOpen(false)}>
        <div style={{ background:'#fff', padding:20, margin:'10% auto', maxWidth:400 }}>
          {selected && (
            <div>
              <h3>{selected.firstName} {selected.lastName}</h3>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default Admin;
