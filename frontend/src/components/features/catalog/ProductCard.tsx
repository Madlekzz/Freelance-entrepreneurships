import { Check, ShoppingBag } from "lucide-react";
import type { ProductCardData } from "../../../types";

interface Props {
  product: ProductCardData;
  qty: number;
  onAdd: () => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

export default function ProductCard({ product, qty, onAdd }: Props) {
  const inCart = qty > 0;

  return (
    /* Agregamos h-full y flex-col para que la card ocupe todo el alto disponible en la fila */
    <div className="group flex flex-col h-full bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Area de Imagen: Altura fija para mantener consistencia */}
      <div className="relative h-40 md:h-48 bg-blue-50/50 flex items-center justify-center overflow-hidden shrink-0">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <ShoppingBag size={40} className="text-primary/20" />
        )}

        {/* Check de Carrito */}
        {inCart && (
          <span className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg border border-primary/10">
            <Check size={14} className="text-primary font-bold" />
          </span>
        )}
      </div>

      {/* Body: Usamos flex-1 para que esta sección empuje el botón hacia abajo */}
      <div className="p-4 flex flex-col flex-1">
        {/* Nombre del Producto: Altura mínima fija para 2 líneas (min-h-[2.5rem]) */}
        <h3 className="font-bold text-gray-800 text-sm md:text-base mb-1.5 line-clamp-2 leading-snug min-h-10 md:min-h-11">
          {product.name}
        </h3>

        {/* Precio */}
        <p className="font-display text-lg md:text-xl font-black text-primary mb-1">
          {fmt(product.price)}
        </p>

        {/* Stock: Ocupa el espacio sobrante con margin-bottom auto */}
        <p className="text-[10px] md:text-xs text-gray-400 mb-4 mt-auto">
          {product.current_stock - qty} disponibles
        </p>

        {/* Botón: Siempre quedará alineado al fondo gracias al mt-auto del stock */}
        <button
          type="button"
          onClick={onAdd}
          disabled={qty >= product.current_stock}
          className={`w-full cursor-pointer py-3 rounded-2xl text-xs md:text-sm font-bold transition-all active:scale-95 ${
            inCart
              ? "bg-blue-50 text-primary border-2 border-primary/10 hover:bg-primary hover:text-white"
              : "bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {inCart ? `En carrito (${qty})` : "Agregar"}
        </button>
      </div>
    </div>
  );
}
