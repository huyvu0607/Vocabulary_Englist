import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider.jsx';
import Navbar from './Navbar.jsx';

function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Đang tải…
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default ProtectedRoute;
