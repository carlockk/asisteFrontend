import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme'; // Asegúrate de que el archivo theme.js esté en src/

import Admin from './pages/Admin';
import Employee from './pages/Employee';
import HistorialEmpleado from './pages/HistorialEmpleado';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <nav style={{ padding: '1rem', backgroundColor: '#fff', borderBottom: '1px solid #ccc' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Empleado</Link>
          <Link to="/admin">Admin</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Employee />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/historial/:id" element={<HistorialEmpleado />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
