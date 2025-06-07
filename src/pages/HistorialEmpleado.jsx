import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Select, MenuItem, FormControl, InputLabel, Table,
  TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import { useParams } from 'react-router-dom';

function HistorialEmpleado() {
  const { id } = useParams();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!id) return;

    const formattedMonth = `${year}-${String(month).padStart(2, '0')}`;

    fetch(`${import.meta.env.VITE_API_URL}/attendance?employeeId=${id}&month=${formattedMonth}`)
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data.records)) {
          setRecords(data.records);
          setTotal(data.total || 0);
        } else {
          setRecords([]);
          setTotal(0);
        }
      })
      .catch(err => {
        console.error('Error cargando historial:', err);
        setRecords([]);
        setTotal(0);
      });
  }, [id, month, year]);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Historial de Asistencia</Typography>
      <Box display="flex" gap={2} mb={2}>
        <FormControl>
          <InputLabel>Mes</InputLabel>
          <Select value={month} onChange={(e) => setMonth(e.target.value)} label="Mes">
            {[...Array(12)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel>Año</InputLabel>
          <Select value={year} onChange={(e) => setYear(e.target.value)} label="Año">
            {[2024, 2025, 2026].map(y => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Entrada</TableCell>
            <TableCell>Salida</TableCell>
            <TableCell>Horas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((r, i) => {
            const checkIn = r.checkIn ? new Date(r.checkIn) : null;
            const checkOut = r.checkOut ? new Date(r.checkOut) : null;
            return (
              <TableRow key={i}>
                <TableCell>{checkIn?.toLocaleDateString() || '-'}</TableCell>
                <TableCell>{checkIn?.toLocaleTimeString() || '-'}</TableCell>
                <TableCell>{checkOut?.toLocaleTimeString() || '-'}</TableCell>
                <TableCell>{r.totalHours?.toFixed(2) || '0.00'}</TableCell>
              </TableRow>
            );
          })}
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
