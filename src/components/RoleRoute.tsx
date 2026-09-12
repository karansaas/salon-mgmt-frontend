import { Navigate, Outlet, useLocation } from 'react-router-dom';
import type { UserRole } from '../types/auth';
import { useAuth } from '../features/auth/AuthProvider';

export const RoleRoute = ({ allowedRoles }: { allowedRoles: UserRole[] }) => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to={user.role === 'Employee' ? '/my-attendance' : user.role === 'Receptionist' ? '/billing' : '/admin'} replace />;
};
