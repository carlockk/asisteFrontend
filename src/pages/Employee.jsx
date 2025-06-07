import React, { useState, useEffect } from 'react';
import {
  Button, Typography, MenuItem, Select,
  FormControl, InputLabel, Box
} from '@mui/material';

function Employee() {
  const [time, setTime] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState('');
  const [lastEntry, setLastEntry] = useState(null);
  const [entradaActiva, setEntradaActiva] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/employees`)
      .then(res => res.json())
      .then(setEmployees);
  }, []);

  useEffect(() => {
    if (!selected) return;
    const month = new Date().toISOString().slice(0, 7);
    fetch(`${import.meta.env.VITE_API_URL}/attendance?employeeId=${selected}&month=${month}`)
      .then(res => res.json())
      .then(data => {
        const last = [...(data.records || [])].reverse().find(r => r.checkIn);
        if (last) {
          setLastEntry(last.checkIn);
          setEntradaActiva(!last.checkOut);
        } else {
          setLastEntry(null);
          setEntradaActiva(false);
        }
      });
  }, [selected]);

  const mark = async (type) => {
    if (!selected) return alert('Selecciona un empleado');
    const now = new Date();

    const body = type === 'checkIn'
      ? { employeeId: selected }
      : { employeeId: selected, checkOut: now };

    const res = await fetch(`${import.meta.env.VITE_API_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (data._id) {
      if (type === 'checkIn') {
        setEntradaActiva(true);
        setLastEntry(now);
      } else {
        setEntradaActiva(false);
      }
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {time.toLocaleTimeString()}
      </Typography>

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

      {lastEntry && (
        <Typography variant="body2" sx={{ mt: 2, color: 'gray' }}>
          👉 Última entrada: {new Date(lastEntry).toLocaleTimeString()}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          disabled={!selected || entradaActiva}
          onClick={() => mark('checkIn')}
        >
          Entrada
        </Button>
        <Button
          variant="contained"
          disabled={!selected || !entradaActiva}
          onClick={() => mark('checkOut')}
        >
          Salida
        </Button>
      </Box>
    </Box>
  );
}

export default Employee;
