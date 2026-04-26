import { Dropdown, type MenuProps } from "antd";
import {
  ArrowRight,
  Edit2,
  MoreVertical,
  Package,
  Store,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Entrepreneurship } from "../../../types";

interface Props {
  biz: Entrepreneurship;
  onEdit: (biz: Entrepreneurship) => void;
  onDelete: (id: string, name: string) => void;
}

export default function EntrepreneurshipCard({ biz, onEdit, onDelete }: Props) {
  const navigate = useNavigate();

  // Definimos los items aquí mismo para evitar problemas de contexto y el operador coma
  const menuItems: MenuProps["items"] = [
    {
      key: "edit",
      label: "Editar información",
      icon: <Edit2 size={14} />,
      onClick: ({ domEvent }) => {
        domEvent.stopPropagation();
        onEdit(biz);
      },
    },
    {
      key: "delete",
      label: "Eliminar emprendimiento",
      icon: <Trash2 size={14} />,
      danger: true,
      onClick: ({ domEvent }) => {
        domEvent.stopPropagation();
        onDelete(biz.id, biz.name);
      },
    },
  ];

  return (
    <button
      type="button"
      onClick={() => navigate(`/dashboard/entrepreneurships/${biz.id}`)}
      className="group cursor-pointer relative bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full text-left w-full"
    >
      <div className="absolute top-5 right-5">
        <Dropdown
          menu={{ items: menuItems }} // Pasamos el objeto directamente
          trigger={["click"]}
          placement="bottomRight"
        >
          <button
            type="button"
            onClick={(e) => e.stopPropagation()} // Detenemos el burbujeo aquí también
            className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <MoreVertical size={20} />
          </button>
        </Dropdown>
      </div>

      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
        <Store size={28} />
      </div>

      <h3 className="text-xl font-bold text-gray-900 leading-tight">
        {biz.name}
      </h3>

      <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 my-4 w-full">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
            Productos
          </span>
          <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
            <Package size={14} className="text-primary" /> {biz.product_count}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
            Desde
          </span>
          <span className="text-sm font-bold text-gray-700">
            {new Date(biz.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-center text-primary font-bold text-sm gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        Administrar <ArrowRight size={16} />
      </div>
    </button>
  );
}
