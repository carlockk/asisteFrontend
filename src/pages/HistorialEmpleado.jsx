import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { useParams } from 'react-router-dom';

function HistorialEmpleado() {
  const { id } = useParams();
  const [dates, setDates] = useState([]);
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (dates.length === 0 || !id) return;

    const formattedDates = dates.map(d => d.toISOString().split('T')[0]);

    fetch(`${import.meta.env.VITE_API_URL}/attendance/filter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: id, dates: formattedDates })
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          setRecords([]);
          setTotal(0);
          return;
        }

        const processed = data.map(r => {
          const checkIn = r.checkIn ? new Date(r.checkIn) : null;
          const checkOut = r.checkOut ? new Date(r.checkOut) : null;
          let totalHours = r.totalHours;

          if (checkIn && checkOut && (typeof totalHours === 'undefined')) {
            const diffMs = checkOut - checkIn;
            totalHours = diffMs / (1000 * 60 * 60); // ms to hours
          }

          return { ...r, checkIn, checkOut, totalHours: totalHours || 0 };
        });

        setRecords(processed);
        const sum = processed.reduce((acc, r) => acc + (r.totalHours || 0), 0);
        setTotal(sum);
      });
  }, [dates, id]);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Historial de Asistencia</Typography>

      <Flatpickr
        options={{ mode: 'multiple', dateFormat: 'Y-m-d' }}
        onChange={setDates}
        placeholder="Selecciona fechas"
      />

      <Table sx={{ mt: 3 }}>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Entrada</TableCell>
            <TableCell>Salida</TableCell>
            <TableCell>Horas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((r, i) => (
            <TableRow key={i}>
              <TableCell>{r.checkIn?.toLocaleDateString() || '-'}</TableCell>
              <TableCell>{r.checkIn?.toLocaleTimeString() || '-'}</TableCell>
              <TableCell>{r.checkOut?.toLocaleTimeString() || '-'}</TableCell>
              <TableCell>{r.totalHours.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box mt={2}>
        <Typography><strong>Total Horas:</strong> {total.toFixed(2)} hrs</Typography>
      </Box>
    </Box>
  );
}

export default HistorialEmpleado;
