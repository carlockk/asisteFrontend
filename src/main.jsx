import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

import Admin from './pages/Admin';
import Employee from './pages/Employee';
import HistorialEmpleado from './pages/HistorialEmpleado';
import Vacaciones from './pages/Vacaciones'; // ✅ NUEVA PÁGINA

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <nav style={{ padding: '1rem', backgroundColor: '#fff', borderBottom: '1px solid #ccc' }}>
          <Link to="/" style={{ marginRight: '1rem' }}>Empleado</Link>
          <Link to="/admin" style={{ marginRight: '1rem' }}>Admin</Link>
          <Link to="/vacaciones" style={{ marginRight: '1rem' }}>Vacaciones</Link> {/* ✅ NUEVO */}
        </nav>
        <Routes>
          <Route path="/" element={<Employee />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/historial/:id" element={<HistorialEmpleado />} />
          <Route path="/vacaciones" element={<Vacaciones />} /> {/* ✅ NUEVO */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
