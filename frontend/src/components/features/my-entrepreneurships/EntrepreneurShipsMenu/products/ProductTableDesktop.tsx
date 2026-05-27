import { Dropdown, type MenuProps } from "antd";
import { MoreVertical, Package } from "lucide-react";
import type { EntrepreneurshipProduct } from "../../../../../types";
import { formatCurrency } from "../../../../../utils/format";

interface Props {
  products: EntrepreneurshipProduct[];
  getActionMenu: (product: EntrepreneurshipProduct) => MenuProps;
}

export default function ProductTableDesktop({
  products,
  getActionMenu,
}: Props) {
  return (
    <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Producto
            </th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((product) => (
            <tr
              key={product.id}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        className="object-cover w-full h-full"
                        alt=""
                      />
                    ) : (
                      <Package size={20} />
                    )}
                  </div>
                      <span className="font-semibold text-gray-700">
                        {product.name}
                      </span>
                      {product.is_composed && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-bold uppercase">
                          Combo
                        </span>
                      )}
                </div>
              </td>
              <td className="px-6 py-4 font-medium text-gray-600">
                {formatCurrency(product.price)}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`text-sm font-bold ${product.current_stock < 5 ? "text-amber-500" : "text-gray-500"}`}
                >
                  {product.current_stock} un.
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${product.is_active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}
                >
                  {product.is_active ? "Activo" : "Pausado"}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <Dropdown
                  menu={getActionMenu(product)}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                  >
                    <MoreVertical size={18} />
                  </button>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
