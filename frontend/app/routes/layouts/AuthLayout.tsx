import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '~/store/authStore';

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    console.debug('AuthLayout: user is authenticated, redirecting to /');
    return <Navigate to='/' replace state={{ from: location }} />;
  }
  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4'>
      <div className='bg-blueprint-grid pointer-events-none absolute inset-0 opacity-[0.07]' />
      <div className='relative z-10 w-full max-w-sm'>
        <div className='mb-8 flex items-center justify-center gap-2'>
          <span className='h-6 w-1.5 rounded-full bg-signal-500' />
          <span className='font-display text-2xl font-bold tracking-tight text-white'>PLANIX</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
