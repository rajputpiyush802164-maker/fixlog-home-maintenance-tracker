import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: loc }} replace />;
}
