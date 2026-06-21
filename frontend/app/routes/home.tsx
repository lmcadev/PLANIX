import type { Route } from './+types/home';
import { Welcome } from '../welcome/welcome';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'New React Router App' }, { name: 'description', content: 'Welcome to React Router!' }];
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>Oops!</h1>
      <p>An unexpected error occurred.</p>
      {import.meta.env.DEV && error instanceof Error && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{error.stack}</code>
        </pre>
      )}
    </main>
  );
}

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <h1>Home Layout</h1>
      {children}
    </div>
  );
}

export default function Home() {
  return <Welcome />;
}
