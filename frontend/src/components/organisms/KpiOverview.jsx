import { CalendarRange, CheckCircle2, Clock, TrendingUp, XCircle } from "lucide-react";
import StatCard from "../molecules/StatCard";
import Card from "../atoms/Card";
import EmptyState from "../molecules/EmptyState";

export default function KpiOverview({ kpis }) {
  if (!kpis) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Total agendas" value={kpis.total_schedules} icon={CalendarRange} />
        <StatCard label="Finalizadas" value={kpis.completed_schedules} tone="green" icon={CheckCircle2} />
        <StatCard label="Canceladas" value={kpis.cancelled_schedules} tone="red" icon={XCircle} />
        <StatCard label="Pendientes" value={kpis.pending_schedules} tone="amber" icon={Clock} />
        <StatCard
          label="Cumplimiento"
          value={`${kpis.compliance_percentage}%`}
          tone="blue"
          icon={TrendingUp}
        />
      </div>
      <Card>
        <p className="mb-4 text-sm font-semibold text-slate-700">Horas ocupadas por usuario</p>
        {kpis.occupied_hours_by_user.length === 0 ? (
          <EmptyState title="Sin datos de ocupacion" />
        ) : (
          <div className="flex flex-col gap-1">
            {kpis.occupied_hours_by_user.map((row) => (
              <div
                key={row.user_id}
                className="flex items-center justify-between rounded-lg px-2 py-2.5 text-sm transition-colors hover:bg-slate-50"
              >
                <span className="text-slate-600">{row.email}</span>
                <span className="font-semibold text-slate-900">{row.hours} h</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
