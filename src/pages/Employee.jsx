import React, { useState, useEffect } from 'react';
import { Button, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

function Employee() {
  const [time, setTime] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState('');
  const [lastIn, setLastIn] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/employees`)
      .then(res => res.json())
      .then(setEmployees);
  }, []);

  const mark = async (type) => {
    if (!selected) return alert('Selecciona un empleado');

    const now = new Date();
    const payload = {
      employeeId: selected,
      [type]: now
    };

    const res = await fetch(`${import.meta.env.VITE_API_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (type === 'checkIn') {
      setLastIn(now);
    }

    alert(`Marcado de ${type === 'checkIn' ? 'entrada' : 'salida'} exitoso`);
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>{time.toLocaleTimeString()}</Typography>

      <FormControl fullWidth>
        <InputLabel>Selecciona un empleado</InputLabel>
        <Select
          value={selected}
          label="Empleado"
          onChange={e => setSelected(e.target.value)}
        >
          {employees.map(emp => (
            <MenuItem key={emp._id} value={emp._id}>
              {emp.firstName} {emp.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {lastIn && (
        <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
          👉 Última entrada: {new Date(lastIn).toLocaleTimeString()}
        </Typography>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
        <Button variant="contained" disabled={!selected} onClick={() => mark('checkIn')}>Entrada</Button>
        <Button variant="contained" disabled={!selected} onClick={() => mark('checkOut')}>Salida</Button>
      </div>
    </div>
  );
}

export default Employee;
