import { LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import type { SidebarUser, UserRole } from "../../../types";

interface Props {
  user: SidebarUser | null;
  roles: UserRole[];
}

export default function WelcomeHeader({ user, roles }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          ¡Hola, {user?.name}! 👋
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {roles.length > 1
            ? "Aquí tienes un resumen consolidado de todas tus labores."
            : "Este es el estado actual de tu actividad en la plataforma."}
        </p>
      </div>
      <Link
        to="/"
        className="flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-100 transition-all"
      >
        <LayoutGrid size={20} />
        <span>Ver Catálogo</span>
      </Link>
    </div>
  );
}
