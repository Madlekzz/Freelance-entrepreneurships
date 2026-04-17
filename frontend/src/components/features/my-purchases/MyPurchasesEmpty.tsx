import { ShoppingBag } from "lucide-react";

export default function MyPurchasesEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
        <ShoppingBag size={32} className="text-gray-300 opacity-20" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">
        No se encontraron compras
      </h3>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
        Aún no has realizado ningún pedido o no coinciden con tu búsqueda.
      </p>
    </div>
  );
}
