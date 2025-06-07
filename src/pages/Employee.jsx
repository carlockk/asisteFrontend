import React, { useState, useEffect } from 'react';
import { Button, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';

function Employee() {
  const [time, setTime] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [lastEntry, setLastEntry] = useState(null);
  const [lastExit, setLastExit] = useState(null);

  // Reloj en vivo
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Cargar empleados al inicio
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/employees`)
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error('Error cargando empleados:', err));
  }, []);

  // Cargar asistencia del mes al cambiar empleado
  useEffect(() => {
    if (!employeeId) return;

    const now = new Date();
    const month = now.toISOString().slice(0, 7); // YYYY-MM

    fetch(`${import.meta.env.VITE_API_URL}/attendance?employeeId=${employeeId}&month=${month}`)
      .then(res => res.json())
      .then(data => {
        const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
        const todayRecords = data.records.filter(r => r.checkIn?.startsWith(today));
        if (todayRecords.length > 0) {
          const last = todayRecords[todayRecords.length - 1];
          setLastEntry(last.checkIn);
          setLastExit(last.checkOut || null);
        } else {
          setLastEntry(null);
          setLastExit(null);
        }
      })
      .catch(err => {
        console.error('Error cargando asistencia:', err);
        setLastEntry(null);
        setLastExit(null);
      });
  }, [employeeId]);

  const mark = async (type) => {
    if (!employeeId) {
      alert('Selecciona un empleado antes de marcar.');
      return;
    }

    const now = new Date();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          [type]: now
        })
      });
      const data = await res.json();
      if (type === 'checkIn') {
        setLastEntry(now.toISOString());
      } else {
        setLastExit(now.toISOString());
      }
      alert('Marcado con éxito');
    } catch (error) {
      console.error('Error al marcar asistencia:', error);
      alert('Error al marcar asistencia');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{time.toLocaleTimeString()}</h2>

      <FormControl fullWidth style={{ marginBottom: 20 }}>
        <InputLabel>Selecciona un empleado</InputLabel>
        <Select
          value={employeeId}
          label="Empleado"
          onChange={(e) => {
            setEmployeeId(e.target.value);
          }}
        >
          {employees.map((emp) => (
            <MenuItem key={emp._id} value={emp._id}>
              {emp.firstName} {emp.lastName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {lastEntry && (
        <Typography color="primary" style={{ marginBottom: 5 }}>
          👉 Última entrada: {new Date(lastEntry).toLocaleTimeString()}
        </Typography>
      )}
      {lastExit && (
        <Typography color="secondary" style={{ marginBottom: 20 }}>
          👉 Última salida: {new Date(lastExit).toLocaleTimeString()}
        </Typography>
      )}

      <Button variant="contained" onClick={() => mark('checkIn')} disabled={!employeeId}>
        Entrada
      </Button>
      <Button
        variant="contained"
        onClick={() => mark('checkOut')}
        disabled={!employeeId}
        style={{ marginLeft: 10 }}
      >
        Salida
      </Button>
    </div>
  );
}

export default Employee;
