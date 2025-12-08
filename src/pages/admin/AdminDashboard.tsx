import { nenufar, flower } from "../../assets/svg-icons/index";
import { AdminCard } from "../../components/ui";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6 justify-center">
      <div className="flex gap-6">
        <AdminCard
          to="/admin/users"
          bgColor="bg-secondary"
          textColor="text-neutral"
          padding="p-10"
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
          bgColor="bg-brand"
          padding="p-10"
          icon={{
            src: nenufar,
            alt: "nenúfar decorativo",
            className: "absolute -left-3 -top-2 w-[50px]",
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
        Usuarios Utilizando la aplicacion: 20
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
        Usuarios Suscriptos: 21
      </AdminCard>
    </div>
  );
}
