import { nuriAlegreCut, nuriFireCut } from "../../assets/ilustrations/index";
import { metricGreen, checkBlue, metricBlue } from "../../assets/svg-icons/index";
import { MetricCard, StreakCard } from "../../components/ui";
import { useFetchData } from "../../hooks";
import type { IUserMetrics } from "../../interfaces";
import { metricsService } from "../../services/metricsService";
import Loading from "../../components/Loading";
import StateMessage from "../../components/StateMessage";

export default function Metrics() {
  const {
    data: stats,
    loading,
    errorMessage,
  } = useFetchData<IUserMetrics>({
    fetchFn: metricsService.getUserMetrics,
  });

  if (loading) {
    return <Loading />;
  }

  if (errorMessage) {
    return <StateMessage itemName="las estadísticas" variant="error" />;
  }

  return (
    <div className="flex flex-col gap-6 justify-center">
      <h2 className="font-bold">Tus Métricas</h2>

      <div className="flex gap-4">
        <StreakCard
          label="Racha actual"
          value={stats?.currentStreak || 0}
          icon={nuriFireCut}
          iconAlt="nuri con fuego"
          textColor="text-[#D0411F]"
        />

        <StreakCard
          label="Mejor racha"
          value={stats?.bestStreak || 0}
          icon={nuriAlegreCut}
          iconAlt="nuri alegre"
          textColor="text-[#FCB259]"
        />
      </div>


      <div className="bg-white rounded-lg p-6 shadow-lg shadow-tertiary-dark/25">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-base">Progreso Semanal</span>
          <span className="font-semibold">{stats?.achievementsProgress?.percentage || 0}%</span>
        </div>
        <div className="flex-1 bg-[#EDCBB1] rounded-full h-5 overflow-hidden">
          <div
            className="bg-tertiary h-full transition-all duration-300"
            style={{ width: `${stats?.achievementsProgress?.percentage || 0}%` }}
          />
        </div>
      </div>

      <MetricCard
        label="Tareas Realizadas"
        value={stats?.totalTasksCompleted || 0}
        icon={checkBlue}
        textColor="text-brand"
      />

      <MetricCard
        label="Metas Cumplidas"
        value={stats?.totalGoalsCompleted || 0}
        icon={metricBlue}
        textColor="text-primary"
      />

      <MetricCard
        label="Total de Metas Realizadas este Mes"
        value={stats?.totalGoalsCompleted || 0}
        icon={metricGreen}
        textColor="text-[#002F39]"
      />

    </div>
  );
}
