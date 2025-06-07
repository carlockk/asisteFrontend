import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { useParams } from 'react-router-dom';

function HistorialEmpleado() {
  const { id } = useParams();
  const [range, setRange] = useState([]); // desde/hasta
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!id || range.length !== 2) return;

    // generar lista de fechas entre start y end
    const start = range[0];
    const end = range[1];
    const dates = [];

    for (
      let d = new Date(start);
      d <= end;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(new Date(d).toISOString().split('T')[0]);
    }

    fetch(`${import.meta.env.VITE_API_URL}/attendance/filter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: id, dates })
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          setRecords([]);
          setTotal(0);
          return;
        }

        const enriched = data.map(r => {
          const checkIn = r.checkIn ? new Date(r.checkIn) : null;
          const checkOut = r.checkOut ? new Date(r.checkOut) : null;
          let totalHours = r.totalHours;

          if (!totalHours && checkIn && checkOut) {
            const diff = checkOut - checkIn;
            totalHours = diff / (1000 * 60 * 60);
          }

          return { ...r, checkIn, checkOut, totalHours: totalHours || 0 };
        });

        setRecords(enriched);
        const sum = enriched.reduce((acc, r) => acc + (r.totalHours || 0), 0);
        setTotal(sum);
      });
  }, [id, range]);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Historial de Asistencia</Typography>

      <Flatpickr
        options={{ mode: 'range', dateFormat: 'Y-m-d' }}
        onChange={setRange}
        placeholder="Selecciona rango de fechas"
        className="form-control"
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
              <TableCell>{r.checkIn ? new Date(r.checkIn).toLocaleDateString() : '-'}</TableCell>
              <TableCell>{r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '-'}</TableCell>
              <TableCell>{r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : '-'}</TableCell>
              <TableCell>{(r.totalHours || 0).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box mt={2}>
        <Typography variant="subtitle1">
          <strong>Total Horas:</strong> {total.toFixed(2)} hrs
        </Typography>
      </Box>
    </Box>
  );
}

export default HistorialEmpleado;
