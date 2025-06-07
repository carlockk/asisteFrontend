// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Admin from './pages/Admin';
import Employee from './pages/Employee';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Empleado</Link> | <Link to="/admin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Employee />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
