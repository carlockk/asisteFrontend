import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, InputLabel, FormControl, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useParams } from 'react-router-dom';

function HistorialEmpleado() {
  const { id } = useParams();
  const [registros, setRegistros] = useState([]);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [anio, setAnio] = useState(new Date().getFullYear());
  const [totalHoras, setTotalHoras] = useState(0);
  const [valorHora, setValorHora] = useState(0);

  useEffect(() => {
    const mesStr = mes < 10 ? `0${mes}` : mes;
    const fecha = `${anio}-${mesStr}`;
    fetch(`${import.meta.env.VITE_API_URL}/attendance?employeeId=${id}&month=${fecha}`)
      .then(res => res.json())
      .then(data => {
        setRegistros(data.records);
        setTotalHoras(data.total);
        if (data.records[0]?.employee?.hourlyRate) {
          setValorHora(data.records[0].employee.hourlyRate);
        }
      });
  }, [id, mes, anio]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Historial de Asistencia</Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl>
          <InputLabel>Mes</InputLabel>
          <Select value={mes} label="Mes" onChange={e => setMes(e.target.value)}>
            {[...Array(12)].map((_, i) => (
              <MenuItem key={i+1} value={i+1}>{i+1}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Año</InputLabel>
          <Select value={anio} label="Año" onChange={e => setAnio(e.target.value)}>
            {[2024, 2025].map(y => (
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
          {registros.map(r => (
            <TableRow key={r._id}>
              <TableCell>{new Date(r.checkIn).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(r.checkIn).toLocaleTimeString()}</TableCell>
              <TableCell>{r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : '-'}</TableCell>
              <TableCell>{r.totalHours?.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ mt: 2 }}>
        <Typography><strong>Total Horas:</strong> {totalHoras.toFixed(2)} hrs</Typography>
        {valorHora > 0 && (
          <Typography><strong>Total ganado:</strong> ${ (totalHoras * valorHora).toFixed(2) }</Typography>
        )}
      </Box>
    </Box>
  );
}

export default HistorialEmpleado;
