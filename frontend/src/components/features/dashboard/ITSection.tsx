import { ShieldCheck, UserPlus, Users, Zap } from "lucide-react";
import { SectionHeader } from "./shared/SectionHeader";
import { StatCard } from "./shared/StatCard";

interface Props {
  data: {
    totalUsers: number;
    pendingRequests: number;
    activeSessions: number;
  };
}

export default function ITSection({ data }: Props) {
  return (
    <section className="space-y-6 animate-in slide-in-from-left duration-500 delay-150">
      <SectionHeader
        title="Infraestructura y Sistema"
        icon={ShieldCheck}
        color="text-blue-600"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Sesiones Activas"
          value={data.activeSessions}
          icon={Zap}
          color="bg-amber-500"
          description="Usuarios activos (últimas 24h)"
        />
        <StatCard
          label="Solicitudes Pendientes"
          value={data.pendingRequests}
          icon={UserPlus}
          color="bg-blue-600"
          description="Registros esperando aprobación"
        />
        <StatCard
          label="Usuarios Totales"
          value={data.totalUsers}
          icon={Users}
          color="bg-slate-800"
          description="Cuentas en el ecosistema"
        />
      </div>
    </section>
  );
}
