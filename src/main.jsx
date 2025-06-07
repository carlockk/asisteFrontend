import React from 'react';
import ReactDOM from 'react-dom';
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

ReactDOM.render(<App />, document.getElementById('root'));
