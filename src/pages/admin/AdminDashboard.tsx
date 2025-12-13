import { nenufar, flower } from "../../assets/svg-icons/index";
import { AdminCard } from "../../components/ui";
import { useFetchData } from "../../hooks";
import type { IAdminDashboardStats } from "../../interfaces";
import { metricsService } from "../../services/metricsService";
import Loading from "../../components/Loading";
import StateMessage from "../../components/StateMessage";

export default function AdminDashboard() {
  const {
    data: stats,
    loading,
    errorMessage,
  } = useFetchData<IAdminDashboardStats>({
    fetchFn: metricsService.getAdminStats,
  });

  if (loading) {
    return <Loading />;
  }

  if (errorMessage) {
    return <StateMessage itemName="las estadísticas" variant="error" />;
  }
  return (
    <div className="flex flex-col gap-6 justify-center">
      <div className="flex gap-6">
        <AdminCard
          to="/admin/users"
          bgColor="bg-secondary"
          textColor="text-neutral"
          padding="p-10"
          shadow="shadow-brand-glow"
          icon={{
            src: flower,
            alt: "flor decorativa",
            className: "absolute left-[105px] -bottom-5 w-[40px]",
          }}
        >
          Gestionar Usuarios
        </AdminCard>

        <AdminCard
          to="/admin/achievements"
          bgColor="bg-secondary"
          textColor="text-neutral"
          padding="p-10"
          shadow="shadow-brand-glow"
          icon={{
            src: flower,
            alt: "nenúfar decorativo",
            className: "absolute left-[105px] -bottom-5 w-[40px]",
          }}
        >
          Gestionar Logros
        </AdminCard>
      </div>

      <AdminCard
        bgColor="bg-brand"
        padding="p-14"
        hasHover={false}
        icon={{
          src: nenufar,
          alt: "nenúfar decorativo",
          className: "absolute -left-3 -top-2 w-[50px]",
        }}
      >
        Usuarios Utilizando la aplicación: {stats?.totalUsers || 0}
      </AdminCard>

      <AdminCard
        bgColor="bg-brand"
        padding="p-14"
        hasHover={false}
        icon={{
          src: nenufar,
          alt: "nenúfar decorativo",
          className: "absolute -left-3 -top-2 w-[50px]",
        }}
      >
        Usuarios Suscriptos: {stats?.subscribedUsers || 0}
      </AdminCard>

      <AdminCard
        bgColor="bg-brand"
        padding="p-14"
        hasHover={false}
        icon={{
          src: nenufar,
          alt: "nenúfar decorativo",
          className: "absolute -left-3 -top-2 w-[50px]",
        }}
      >
        Metas totales: {stats?.totalGoals || 0}
      </AdminCard>

      <AdminCard
        bgColor="bg-brand"
        padding="p-14"
        hasHover={false}
        icon={{
          src: nenufar,
          alt: "nenúfar decorativo",
          className: "absolute -left-3 -top-2 w-[50px]",
        }}
      >
        Plantillas de logros: {stats?.totalAchievementTemplates || 0}
      </AdminCard>

      <AdminCard
        bgColor="bg-brand"
        padding="p-14"
        hasHover={false}
        icon={{
          src: nenufar,
          alt: "nenúfar decorativo",
          className: "absolute -left-3 -top-2 w-[50px]",
        }}
      >
        Logros completados: {stats?.totalAchievementsCompleted || 0}
      </AdminCard>
    </div>
  );
}
