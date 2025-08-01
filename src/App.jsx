import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Box, Menu, MenuItem } from '@mui/material';

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

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

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
        alignItems: 'center',
      }}
    >
      {usuario.rol && (
        <>
          {usuario.rol === 'admin' && (
            <>
              <Link to="/admin">Admin</Link>
              <span
                onMouseEnter={handleMouseEnter}
                style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }}
              >
                Checklist
              </span>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMouseLeave}
                onMouseLeave={handleMouseLeave}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              >
                <MenuItem onClick={handleMouseLeave}>
                  <Link to="/admin/aseo" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Gestionar Aseo
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleMouseLeave}>
                  <Link to="/aseo" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Ver Checklist
                  </Link>
                </MenuItem>
              </Menu>
            </>
          )}
          {usuario.rol === 'gestor' && (
            <>
              <span
                onMouseEnter={handleMouseEnter}
                style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }}
              >
                Checklist
              </span>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMouseLeave}
                onMouseLeave={handleMouseLeave}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              >
                <MenuItem onClick={handleMouseLeave}>
                  <Link to="/admin/aseo" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Gestionar Aseo
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleMouseLeave}>
                  <Link to="/aseo" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Ver Checklist
                  </Link>
                </MenuItem>
              </Menu>
            </>
          )}
          {usuario.rol === 'empleado' && <Link to="/">Empleado</Link>}
          <Link to="/vacaciones">Vacaciones</Link>
        </>
      )}
      {!usuario.rol && <Link to="/login">Login</Link>}
      {usuario.rol && (
        <button
          onClick={cerrarSesion}
          style={{ background: 'transparent', border: '1px solid red', color: 'red', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}
        >
          Cerrar sesión
        </button>
      )}
    </Box>
  );
}

function App() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  return (
    <>
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
    </>
  );
}

export default App;
