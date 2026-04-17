import { LayoutGrid, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function WelcomeHeader({ id }: { id: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">¡Hola de nuevo! 👋</h2>
        <p className="text-gray-500 text-sm mt-1">
          Este es el rendimiento actual de tu emprendimiento.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() =>
            navigate(`/dashboard/entrepreneurships/${id}/products`, {
              state: { openModal: true },
            })
          }
          className="hidden md:flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
        >
          <Plus size={18} /> Nuevo Producto
        </button>
        <Link
          to="/"
          className="hidden md:flex items-center gap-2 bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 transition-all border border-gray-200"
        >
          <LayoutGrid size={20} />
          <span className="font-medium">Ver Catálogo</span>
        </Link>
      </div>
    </div>
  );
}
