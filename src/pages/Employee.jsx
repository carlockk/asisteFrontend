import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';

function Employee() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [lastRecordId, setLastRecordId] = useState(null);

  const handleCheckIn = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: 'ID_DEL_EMPLEADO' }) // reemplaza por auth si usas login
    });
    const data = await res.json();
    setIsCheckedIn(true);
    setLastRecordId(data._id);
  };

  const handleCheckOut = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/attendance/${lastRecordId}/checkout`, {
      method: 'PATCH'
    });
    setIsCheckedIn(false);
    setLastRecordId(null);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Bienvenido</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
      >
        {isCheckedIn ? 'Marcar Salida' : 'Marcar Entrada'}
      </Button>
    </Box>
  );
}

export default Employee;
