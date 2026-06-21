import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Button from "../components/atoms/Button";
import { ROUTES } from "../constants/routes";

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden bg-slate-50 px-4">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-primary-300/30 blur-3xl" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-popover">
        <Compass className="h-8 w-8" />
      </div>
      <p className="relative text-5xl font-bold tracking-tight text-slate-900">404</p>
      <p className="relative text-slate-500">La pagina que buscas no existe.</p>
      <Link to={ROUTES.DASHBOARD} className="relative">
        <Button>Volver al dashboard</Button>
      </Link>
    </div>
  );
}
