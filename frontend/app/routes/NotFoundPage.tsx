import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-paper text-center">
      <p className="font-mono-data text-sm text-muted">Error 404</p>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Esta pagina no existe</h1>
      <p className="max-w-sm text-sm text-muted">
        Revisa la direccion o vuelve al panel principal.
      </p>
      <Button asChild variant="primary" className="mt-2">
        <Link to="/">Volver al panel</Link>
      </Button>
    </div>
  );
}
