import { useDashboard } from "../hooks/useDashboard";
import KpiOverview from "../components/organisms/KpiOverview";
import PageHeader from "../components/molecules/PageHeader";
import Spinner from "../components/atoms/Spinner";
import Alert from "../components/atoms/Alert";

export default function DashboardPage() {
  const { kpis, isLoading, error } = useDashboard();

  return (
    <div>
      <PageHeader title="Dashboard" description="Indicadores generales de las agendas del equipo." />
      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}
      {error && <Alert tone="error">No fue posible cargar los indicadores.</Alert>}
      {!isLoading && !error && <KpiOverview kpis={kpis} />}
    </div>
  );
}
