import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function Vacaciones() {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vacations, setVacations] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/employees`)
      .then(res => res.json())
      .then(setEmployees);
  }, []);

  useEffect(() => {
    if (employeeId) {
      fetch(`${import.meta.env.VITE_API_URL}/vacations/${employeeId}`)
        .then(res => res.json())
        .then(setVacations);
    }
  }, [employeeId]);

  const handleCreateVacation = () => {
    if (!employeeId || !startDate || !endDate) return alert('Faltan campos');

    fetch(`${import.meta.env.VITE_API_URL}/vacations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, startDate, endDate })
    })
      .then(res => res.json())
      .then((newVac) => {
        setVacations([...vacations, newVac]);
        setStartDate('');
        setEndDate('');
      });
  };

  const events = vacations.map(v => ({
    title: 'Vacaciones',
    start: new Date(v.startDate),
    end: new Date(v.endDate),
    allDay: true
  }));

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Gestión de Vacaciones</Typography>

      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Empleado</InputLabel>
          <Select
            value={employeeId}
            label="Empleado"
            onChange={(e) => setEmployeeId(e.target.value)}
          >
            {employees.map(emp => (
              <MenuItem key={emp._id} value={emp._id}>
                {emp.firstName} {emp.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          type="date"
          label="Inicio"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          type="date"
          label="Fin"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateVacation}
          disabled={!employeeId || !startDate || !endDate}
        >
          Registrar
        </Button>
      </Box>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        messages={{
          next: 'Sig.',
          previous: 'Ant.',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día'
        }}
      />
    </Box>
  );
}

export default Vacaciones;
