// ProtectedRoute — guards routes by auth state and role
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    const dashboardPaths = {
      admin: '/admin/dashboard',
      university: '/university/dashboard',
      student: '/student/dashboard',
    };
    return <Navigate to={dashboardPaths[user.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
