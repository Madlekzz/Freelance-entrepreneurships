import { Users } from "lucide-react";

export default function SystemUsersEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
        <Users size={32} className="text-gray-300" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        No se encontraron usuarios
      </h3>
      <p className="text-sm text-gray-500 max-w-50 leading-relaxed">
        Intenta ajustar los filtros o realiza una nueva búsqueda.
      </p>
    </div>
  );
}
