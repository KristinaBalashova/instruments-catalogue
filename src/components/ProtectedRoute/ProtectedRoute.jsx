import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../context/context';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { user } = useContext(UserContext);

  if (user?.role !== 'admin') {
    return <Navigate to="/auth" />;
  }

  return Component;
};

export default ProtectedRoute;
