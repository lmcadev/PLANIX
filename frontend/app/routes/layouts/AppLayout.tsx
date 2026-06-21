import { NavLink, Outlet, useNavigate } from 'react-router';
import { LayoutDashboard, CalendarClock, Users, ShieldCheck, Bell, LogOut } from 'lucide-react';
import { useAuthStore } from '~/store/authStore';
import { authApi } from '~/api/auth';
import { useNotificationsCount } from '~/hooks/useNotificationsCount';
import { cn } from '~/lib/utils';
import { Badge } from '~/components/ui/badge';

const navItems = [
  { to: '/', label: 'Panel', icon: LayoutDashboard, roles: null },
  { to: '/schedules', label: 'Agendas', icon: CalendarClock, roles: null },
  { to: '/users', label: 'Usuarios', icon: Users, roles: ['admin'] },
  { to: '/roles', label: 'Roles y permisos', icon: ShieldCheck, roles: ['admin'] },
] as const;

export default function AppLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const refresh = useAuthStore((s) => s.refresh);
  const hasRole = useAuthStore((s) => s.hasRole);
  const logout = useAuthStore((s) => s.logout);
  const unread = useNotificationsCount();

  async function handleLogout() {
    try {
      if (refresh) await authApi.logout(refresh);
    } catch {
      // si el refresh ya estaba vencido o invalido no pasa nada, igual cerramos sesion local
    } finally {
      logout();
      navigate('/login', { replace: true });
    }
  }

  return (
    <div className='flex min-h-screen bg-paper'>
      <aside className='flex w-60 shrink-0 flex-col border-r border-line bg-ink-950 text-white'>
        <div className='flex items-center gap-2 px-5 py-5'>
          <span className='h-6 w-1.5 rounded-full bg-signal-500' />
          <span className='font-display text-lg font-bold tracking-tight'>PLANIX</span>
        </div>

        <nav className='flex-1 space-y-1 px-3 py-2'>
          {navItems
            .filter((item) => !item.roles || hasRole(...item.roles))
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-800 hover:text-white',
                    isActive && 'bg-signal-500 text-white hover:bg-signal-500',
                  )
                }>
                <item.icon className='size-4' />
                {item.label}
              </NavLink>
            ))}
        </nav>

        <div className='border-t border-ink-800 px-3 py-3'>
          <button
            onClick={handleLogout}
            className='flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-800 hover:text-white'>
            <LogOut className='size-4' />
            Cerrar sesion
          </button>
        </div>
      </aside>

      <div className='flex min-w-0 flex-1 flex-col'>
        <header className='flex items-center justify-between border-b border-line bg-surface px-6 py-3'>
          <div className='text-sm text-muted'>
            {user ? (
              <span>
                Hola, <span className='font-medium text-ink-900'>{user.first_name}</span>
              </span>
            ) : null}
          </div>
          <div className='flex items-center gap-4'>
            <NavLink to='/notifications' className='relative flex items-center text-ink-700 hover:text-ink-900'>
              <Bell className='size-5' />
              {unread > 0 ? (
                <Badge variant='flag' className='absolute -right-2 -top-2 h-5 min-w-5 justify-center rounded-full px-1'>
                  {unread}
                </Badge>
              ) : null}
            </NavLink>
            <div className='flex items-center gap-2'>
              <div className='flex size-8 items-center justify-center rounded-full bg-signal-100 font-mono-data text-xs font-semibold text-signal-700'>
                {user ? `${user.first_name[0] ?? ''}${user.last_name[0] ?? ''}`.toUpperCase() : '--'}
              </div>
            </div>
          </div>
        </header>

        <main className='flex-1 overflow-y-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
