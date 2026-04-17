import { Plus } from "lucide-react";

interface Props {
  onAddProduct: () => void;
}

export default function ProductHeader({ onAddProduct }: Props) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-xl font-bold text-gray-900">Mis Productos</h2>
      <button
        type="button"
        onClick={onAddProduct}
        className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-sm cursor-pointer"
      >
        <Plus size={18} /> Agregar Producto
      </button>
    </div>
  );
}
