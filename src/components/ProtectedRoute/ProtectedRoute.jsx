import { useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context';

import { ROLE_ADMIN } from '../../strings';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== ROLE_ADMIN) {
      navigate('/');
    }
  }, [user, navigate]);

  return children;
};

export default ProtectedRoute;
