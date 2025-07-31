import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Button, Box } from '@mui/material';
import theme from './theme';

import Admin from './pages/Admin';
import Employee from './pages/Employee';
import HistorialEmpleado from './pages/HistorialEmpleado';
import Vacaciones from './pages/Vacaciones';
import AseoChecklist from './pages/AseoChecklist';
import AdminAseo from './pages/AdminAseo';
import Login from './pages/Login';

function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <Box
      sx={{
        padding: '1rem',
        backgroundColor: '#fff',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        gap: 2,
        alignItems: 'center'
      }}
    >
      {usuario.rol && (
        <>
          {usuario.rol === 'admin' && (
            <>
              <Link to="/admin">Admin</Link>
              <Link to="/admin/aseo">Gestionar Aseo</Link>
            </>
          )}
          {usuario.rol === 'gestor' && <Link to="/admin/aseo">Gestionar Aseo</Link>}
          {usuario.rol === 'empleado' && <Link to="/">Empleado</Link>}
          <Link to="/aseo">Aseo Personal</Link>
          <Link to="/vacaciones">Vacaciones</Link>
        </>
      )}
      {!usuario.rol && <Link to="/login">Login</Link>}
      {usuario.rol && (
        <Button variant="outlined" color="error" onClick={cerrarSesion}>
          Cerrar sesión
        </Button>
      )}
    </Box>
  );
}

function App() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Employee />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/historial/:id" element={<HistorialEmpleado />} />
          <Route path="/vacaciones" element={<Vacaciones />} />
          <Route path="/aseo" element={<AseoChecklist usuario={usuario} />} />
          <Route path="/admin/aseo" element={<AdminAseo usuario={usuario} />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
