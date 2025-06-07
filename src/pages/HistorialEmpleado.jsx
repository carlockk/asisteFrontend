import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Select, MenuItem, FormControl, InputLabel,
  Table, TableBody, TableCell, TableHead, TableRow, Pagination
} from '@mui/material';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { useParams } from 'react-router-dom';

function HistorialEmpleado() {
  const { id } = useParams();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [range, setRange] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  // Cargar datos por mes y año (cuando no hay rango seleccionado)
  useEffect(() => {
    if (!id || range.length === 2) return;

    const formattedMonth = `${year}-${String(month).padStart(2, '0')}`;

    fetch(`${import.meta.env.VITE_API_URL}/attendance?employeeId=${id}&month=${formattedMonth}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.records)) {
          const enriched = data.records.map(r => ({
            ...r,
            checkIn: r.checkIn ? new Date(r.checkIn) : null,
            checkOut: r.checkOut ? new Date(r.checkOut) : null
          }));
          setRecords(enriched);
          setFilteredRecords(enriched);
          setTotal(data.total || 0);
        } else {
          setRecords([]);
          setFilteredRecords([]);
          setTotal(0);
        }
      })
      .catch(err => {
        console.error('Error cargando historial:', err);
        setRecords([]);
        setFilteredRecords([]);
        setTotal(0);
      });
  }, [id, month, year, range]);

  // Si hay rango seleccionado, usa POST /attendance/filter
  useEffect(() => {
    if (!id || range.length !== 2) return;

    const start = range[0];
    const end = range[1];
    const dates = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
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
          setFilteredRecords([]);
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
        setFilteredRecords(enriched);
        const sum = enriched.reduce((acc, r) => acc + (r.totalHours || 0), 0);
        setTotal(sum);
        setCurrentPage(1); // reset page
      });
  }, [id, range]);

  // Calcular registros por página
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Historial de Asistencia</Typography>

      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
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

        <Flatpickr
          options={{ mode: 'range', dateFormat: 'Y-m-d' }}
          onChange={(selectedDates) => {
            setRange(selectedDates);
            if (selectedDates.length !== 2) {
              setFilteredRecords(records);
              setTotal(records.reduce((acc, r) => acc + (r.totalHours || 0), 0));
            }
          }}
          placeholder="Filtrar por rango"
          className="flatpickr-input"
          style={{
            padding: '16.5px 14px',
            border: '1px solid #c4c4c4',
            borderRadius: 4,
            minWidth: 180
          }}
        />
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
          {currentRows.map((r, i) => (
            <TableRow key={i}>
              <TableCell>{r.checkIn ? r.checkIn.toLocaleDateString() : '-'}</TableCell>
              <TableCell>{r.checkIn ? r.checkIn.toLocaleTimeString() : '-'}</TableCell>
              <TableCell>{r.checkOut ? r.checkOut.toLocaleTimeString() : '-'}</TableCell>
              <TableCell>{(r.totalHours || 0).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, val) => setCurrentPage(val)}
            color="primary"
          />
        </Box>
      )}

      <Box mt={2}>
        <Typography variant="subtitle1">
          <strong>Total Horas:</strong> {total.toFixed(2)} hrs
        </Typography>
      </Box>
    </Box>
  );
}

export default HistorialEmpleado;
