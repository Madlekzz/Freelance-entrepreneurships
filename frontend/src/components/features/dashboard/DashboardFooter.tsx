import { LayoutGrid, TrendingUp } from "lucide-react";

interface Props {
  rolesList: string;
}

export default function DashboardFooter({ rolesList }: Props) {
  return (
    <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 relative overflow-hidden flex flex-col justify-center">
      <div className="relative z-10">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
          <TrendingUp size={20} />
        </div>
        <h3 className="text-lg font-bold text-primary mb-2">
          Resumen de Cuenta
        </h3>
        <p className="text-primary/80 text-sm leading-relaxed max-w-2xl">
          Tu cuenta tiene actualmente acceso como: <strong>{rolesList}</strong>.
          Puedes gestionar tus operaciones y visualizar estadísticas
          personalizadas según tus permisos asignados.
        </p>
      </div>
      <LayoutGrid className="absolute -bottom-6 -right-6 text-primary/5 w-40 h-40 rotate-12" />
    </div>
  );
}
