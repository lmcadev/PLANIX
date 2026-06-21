import { useEffect, useState } from "react";
import { CheckCircle2, Clock, ListChecks, XCircle } from "lucide-react";
import { dashboardApi } from "~/api/dashboard";
import type { DashboardKPIs } from "~/types";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";

const STAT_CARDS = [
  { key: "total_schedules" as const, label: "Agendas totales", icon: ListChecks, accent: "text-signal-600 bg-signal-50" },
  { key: "completed_schedules" as const, label: "Finalizadas", icon: CheckCircle2, accent: "text-grass-600 bg-grass-50" },
  { key: "pending_schedules" as const, label: "Pendientes", icon: Clock, accent: "text-amber-600 bg-amber-50" },
  { key: "cancelled_schedules" as const, label: "Canceladas", icon: XCircle, accent: "text-flag-600 bg-flag-50" },
];

export default function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .kpis()
      .then(({ data }) => setKpis(data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink-900">Panel general</h1>
        <p className="text-sm text-muted">Cumplimiento y carga de trabajo del equipo en tiempo real.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : kpis ? (
        <>
          <div className="bg-blueprint-grid rounded-xl border border-ink-800 bg-ink-950 p-6">
            <div className="mb-4 flex items-baseline justify-between">
              <p className="font-mono-data text-xs uppercase tracking-wider text-ink-600">Cumplimiento global</p>
              <p className="font-display text-3xl font-bold text-white">
                {kpis.compliance_percentage.toFixed(1)}
                <span className="text-base font-medium text-ink-600">%</span>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STAT_CARDS.map(({ key, label, icon: Icon, accent }) => (
                <div key={key} className="rounded-lg border border-ink-800 bg-ink-900/80 p-4">
                  <div className={`mb-2 inline-flex size-8 items-center justify-center rounded-md ${accent}`}>
                    <Icon className="size-4" />
                  </div>
                  <p className="font-display text-2xl font-semibold text-white">{kpis[key]}</p>
                  <p className="text-xs text-ink-600">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Horas ocupadas por ingeniero</CardTitle>
            </CardHeader>
            <CardContent>
              {kpis.occupied_hours_by_user.length === 0 ? (
                <p className="text-sm text-muted">Todavia no hay horas registradas.</p>
              ) : (
                <div className="space-y-3">
                  {kpis.occupied_hours_by_user.map((row) => {
                    const max = Math.max(...kpis.occupied_hours_by_user.map((r) => r.hours), 1);
                    return (
                      <div key={row.user_id} className="flex items-center gap-3">
                        <p className="w-44 truncate text-sm text-ink-800">{row.email}</p>
                        <div className="h-2 flex-1 rounded-full bg-paper">
                          <div
                            className="h-2 rounded-full bg-signal-500"
                            style={{ width: `${Math.max((row.hours / max) * 100, 4)}%` }}
                          />
                        </div>
                        <p className="w-16 text-right font-mono-data text-xs text-muted">{row.hours.toFixed(1)}h</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <p className="text-sm text-muted">No se pudieron cargar los indicadores.</p>
      )}
    </div>
  );
}
