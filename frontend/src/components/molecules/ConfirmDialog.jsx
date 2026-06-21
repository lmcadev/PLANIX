import { AlertTriangle } from "lucide-react";
import Button from "../atoms/Button";

export default function ConfirmDialog({ open, title, description, onConfirm, onCancel, isLoading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-popover animate-scale-in">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="mt-4 text-base font-semibold text-slate-900">{title}</p>
        {description && <p className="mt-1.5 text-sm text-slate-500">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
}
