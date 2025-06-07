import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';

function Employee() {
  const [time, setTime] = useState(new Date());
  const [last, setLast] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const mark = async (type) => {
    const confirm = last && !window.confirm(`Ya marcaste a las ${new Date(last).toLocaleTimeString()}. ¿Seguro que quieres volver?`);
    if (confirm) return;
    const res = await fetch('http://localhost:3001/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: 'EMPLOYEE_ID', [type]: new Date() })
    });
    const data = await res.json();
    setLast(data[type === 'checkIn' ? 'checkIn' : 'checkOut']);
    alert('Marcado con éxito');
  };

  return (
    <div>
      <h2>{time.toLocaleTimeString()}</h2>
      <Button variant="contained" onClick={() => mark('checkIn')}>Entrada</Button>
      <Button variant="contained" onClick={() => mark('checkOut')}>Salida</Button>
    </div>
  );
}

export default Employee;
