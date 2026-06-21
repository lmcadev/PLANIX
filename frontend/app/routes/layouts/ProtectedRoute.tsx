import { Navigate, Outlet, redirect, useLocation } from 'react-router';
import { useAuthStore } from '~/store/authStore';
import { useBootstrapUser } from '~/hooks/useBootstrapUser';
import { Spinner } from '~/components/ui/spinner';
import type { Route } from './+types/ProtectedRoute';

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  const { isLoading } = useBootstrapUser();

  if (!isAuthenticated) {
    console.debug('ProtectedRoute: not authenticated, redirecting to login');
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center bg-paper'>
        <Spinner />
      </div>
    );
  }
  console.debug('ProtectedRoute:pre render, isAuthenticated=', isAuthenticated, 'isLoading=', isLoading);
  return <Outlet />;
}
