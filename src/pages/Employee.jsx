import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, MenuItem, Select, InputLabel, FormControl,
} from '@mui/material';

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState('');
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [checkInDisabled, setCheckInDisabled] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/employees`)
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(() => setEmployees([]));
  }, []);

  useEffect(() => {
    if (!selected) return;

    fetch(`${import.meta.env.VITE_API_URL}/attendance?employeeId=${selected}&month=${new Date().toISOString().slice(0, 7)}`)
      .then(res => res.json())
      .then(data => {
        const last = [...(data.records || [])].reverse().find(r => r.checkIn);
        if (last) {
          setLastCheckIn(last);
          setCheckInDisabled(!last.checkOut); // Deshabilita si no hay salida
        } else {
          setLastCheckIn(null);
          setCheckInDisabled(false);
        }
      });
  }, [selected]);

  const handleCheck = (type) => {
    const now = new Date().toISOString();
    const body = type === 'in'
      ? { employeeId: selected }
      : { employeeId: selected, checkOut: now };

    fetch(`${import.meta.env.VITE_API_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(() => {
        setCheckInDisabled(type === 'in');
        setLastCheckIn({ checkIn: now });
      });
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Bienvenido</Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Selecciona un empleado</InputLabel>
        <Select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          label="Selecciona un empleado"
        >
          {employees.map(e => (
            <MenuItem key={e._id} value={e._id}>
              {e.firstName} {e.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selected && (
        <>
          {lastCheckIn?.checkIn && (
            <Typography sx={{ mb: 2 }}>
              👉 Última entrada: {new Date(lastCheckIn.checkIn).toLocaleTimeString()}
            </Typography>
          )}
          <Button
            variant="contained"
            disabled={checkInDisabled}
            onClick={() => handleCheck('in')}
            sx={{ mr: 2 }}
          >
            Entrada
          </Button>
          <Button
            variant="contained"
            disabled={!checkInDisabled}
            onClick={() => handleCheck('out')}
            color="primary"
          >
            Salida
          </Button>
        </>
      )}
    </Box>
  );
}

export default Employee;
