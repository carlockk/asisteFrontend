// src/components/PrivateRoute.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivateRoute({ children, role, allowed }) {
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem('asiste_session');
    if (!session) return navigate('/');

    const parsed = JSON.parse(session);
    if (allowed && !allowed.includes(parsed?.role)) {
      return navigate('/');
    }
  }, [navigate, allowed]);

  return children;
}
