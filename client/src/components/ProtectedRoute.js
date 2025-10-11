// Componente para rutas protegidas con check de rol
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, user } = useAuth();
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;  // Redirige a home si rol no permitido
  }
  return children;
};

export default ProtectedRoute;