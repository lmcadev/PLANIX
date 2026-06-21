import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { authApi } from '~/api/auth';
import { extractErrorMessage } from '~/lib/apiClient';
import { useAuthStore } from '~/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Field } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setTokens = useAuthStore((s) => s.setTokens);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { data } = await authApi.login({ email, password });
      setTokens(data);
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Credenciales invalidas.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inicia sesion</CardTitle>
        <CardDescription>Gestiona agendas y tareas de tu equipo de ingenieria.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <Field label='Correo electronico' htmlFor='email'>
            <Input
              id='email'
              type='email'
              autoComplete='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='nombre~planix.local'
            />
          </Field>
          <Field label='Contrasena' htmlFor='password'>
            <Input
              id='password'
              type='password'
              autoComplete='current-password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='********'
            />
          </Field>

          {error ? <p className='text-sm font-medium text-flag-600'>{error}</p> : null}

          <Button type='submit' variant='primary' disabled={isSubmitting} className='mt-1'>
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>

        <p className='mt-5 text-center text-sm text-muted'>
          No tienes cuenta?{' '}
          <Link to='/register' className='font-medium text-signal-600 hover:underline'>
            Registrate
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
