import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Pagination, Button, Tabs, Tab, Paper
} from '@mui/material';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { useParams } from 'react-router-dom';

function HistorialEmpleado() {
  const { id } = useParams();
  const [tab, setTab] = useState(0);

  // Asistencia
  const [recordsAsistencia, setRecordsAsistencia] = useState([]);
  const [filteredAsistencia, setFilteredAsistencia] = useState([]);
  const [rangeAsistencia, setRangeAsistencia] = useState([]);
  const [totalAsistencia, setTotalAsistencia] = useState(0);
  const [pageAsistencia, setPageAsistencia] = useState(1);

  // Checklist Aseo
  const [checklists, setChecklists] = useState([]);
  const [pageAseo, setPageAseo] = useState(1);

  const rowsPerPage = 15;

  // 🔹 Historial de Asistencia
  useEffect(() => {
    if (!id || rangeAsistencia.length === 2) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    fetch(`${import.meta.env.VITE_API_URL}/attendance?employeeId=${id}&month=${year}-${month}`)
      .then(res => res.json())
      .then(data => {
        const enriched = (data.records || []).map(r => ({
          ...r,
          checkIn: r.checkIn ? new Date(r.checkIn) : null,
          checkOut: r.checkOut ? new Date(r.checkOut) : null
        }));
        const ordered = enriched.sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
        setRecordsAsistencia(ordered);
        setFilteredAsistencia(ordered);
        setTotalAsistencia(data.total || 0);
      })
      .catch(() => {
        setRecordsAsistencia([]);
        setFilteredAsistencia([]);
        setTotalAsistencia(0);
      });
  }, [id, rangeAsistencia]);

  useEffect(() => {
    if (!id || rangeAsistencia.length !== 2) return;

    const [start, end] = rangeAsistencia;
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

        const ordered = enriched.sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
        setRecordsAsistencia(ordered);
        setFilteredAsistencia(ordered);
        const sum = ordered.reduce((acc, r) => acc + (r.totalHours || 0), 0);
        setTotalAsistencia(sum);
        setPageAsistencia(1);
      });
  }, [id, rangeAsistencia]);

  const limpiarFiltro = () => {
    setRangeAsistencia([]);
    setFilteredAsistencia(recordsAsistencia);
    setTotalAsistencia(recordsAsistencia.reduce((acc, r) => acc + (r.totalHours || 0), 0));
    setPageAsistencia(1);
  };

  // 🔹 Historial de Aseo
  useEffect(() => {
    if (!id) return;
    fetch(`${import.meta.env.VITE_API_URL}/aseo/historial/${id}`)
      .then(res => res.json())
      .then(data => {
        const ordenados = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setChecklists(ordenados);
        setPageAseo(1);
      })
      .catch(() => setChecklists([]));
  }, [id]);

  const currentAsistencia = filteredAsistencia.slice((pageAsistencia - 1) * rowsPerPage, pageAsistencia * rowsPerPage);
  const currentAseo = checklists.slice((pageAseo - 1) * rowsPerPage, pageAseo * rowsPerPage);

  return (
    <Paper elevation={3} style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom>Historial del Empleado</Typography>

      <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)} textColor="primary" indicatorColor="primary">
        <Tab label="Asistencia" />
        <Tab label="Checklist Aseo" />
      </Tabs>

      {tab === 0 && (
        <Box mt={3}>
          <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
            <Flatpickr
              options={{ mode: 'range', dateFormat: 'Y-m-d' }}
              onChange={setRangeAsistencia}
              placeholder="Selecciona rango de fechas"
              className="flatpickr-input"
              style={{
                padding: '16.5px 14px',
                border: '1px solid #c4c4c4',
                borderRadius: 4,
                minWidth: 220
              }}
            />
            {rangeAsistencia.length > 0 && (
              <Button onClick={limpiarFiltro} color="secondary" variant="outlined">
                Limpiar Filtro
              </Button>
            )}
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Entrada</TableCell>
                <TableCell>Salida</TableCell>
                <TableCell>Horas</TableCell>
                <TableCell>Nota</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentAsistencia.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.checkIn?.toLocaleDateString() || '-'}</TableCell>
                  <TableCell>{r.checkIn?.toLocaleTimeString() || '-'}</TableCell>
                  <TableCell>{r.checkOut?.toLocaleTimeString() || '-'}</TableCell>
                  <TableCell>{(r.totalHours || 0).toFixed(2)}</TableCell>
                  <TableCell>{r.note || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAsistencia.length > rowsPerPage && (
            <Box mt={2} display="flex" justifyContent="center">
              <Pagination count={Math.ceil(filteredAsistencia.length / rowsPerPage)} page={pageAsistencia} onChange={(e, v) => setPageAsistencia(v)} />
            </Box>
          )}

          <Box mt={2}>
            <Typography><strong>Total Horas:</strong> {totalAsistencia.toFixed(2)} hrs</Typography>
          </Box>
        </Box>
      )}

      {tab === 1 && (
        <Box mt={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Creador</TableCell>
                <TableCell>Total Ítems</TableCell>
                <TableCell>Completados</TableCell>
                <TableCell>Observación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentAseo.map((c, i) => (
                <TableRow key={i}>
                  <TableCell>{new Date(c.fecha).toLocaleDateString()}</TableCell>
                  <TableCell>{c.creadoPor?.nombre || 'Desconocido'}</TableCell>
                  <TableCell>{c.items?.length || 0}</TableCell>
                  <TableCell>{c.items?.filter(i => i.cumple).length || 0}</TableCell>
                  <TableCell>{c.observaciones || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {checklists.length > rowsPerPage && (
            <Box mt={2} display="flex" justifyContent="center">
              <Pagination count={Math.ceil(checklists.length / rowsPerPage)} page={pageAseo} onChange={(e, v) => setPageAseo(v)} />
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
}

export default HistorialEmpleado;
