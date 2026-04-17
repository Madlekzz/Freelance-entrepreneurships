import { Filter, Search, X } from "lucide-react";
import { useState } from "react";

interface Props {
  search: string;
  onSearch: (val: string) => void;
  onOpenFilters?: () => void;
  onOpenCategories?: () => void;
}

export default function CatalogToolbar({
  search,
  onSearch,
  onOpenFilters,
}: Props) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-gray-50/90 backdrop-blur-md md:static md:bg-transparent md:backdrop-blur-none py-4 md:py-0 mb-6 md:mb-12">
      <div className="relative flex items-center justify-between gap-4 h-11">
        {/* 1. TÍTULO Y SUBTOTAL (Se desvanece en mobile al buscar) */}
        <div
          className={`transition-all duration-300 transform ${
            showMobileSearch
              ? "opacity-0 -translate-x-4 pointer-events-none"
              : "opacity-100 translate-x-0"
          } md:opacity-100 md:translate-x-0`}
        >
          <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900 leading-tight">
            Catálogo
          </h2>
          {/* Indicador de búsqueda activa si el input está cerrado */}
          {search && !showMobileSearch && (
            <span className="md:hidden text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
              Filtrando: "{search}"
            </span>
          )}
        </div>

        {/* 2. CONTENEDOR DINÁMICO (Search + Buttons) */}
        <div
          className={`absolute right-0 flex items-center transition-all duration-300 ${
            showMobileSearch ? "w-full" : "w-auto"
          } md:relative md:w-auto md:flex-1 md:justify-end gap-2`}
        >
          {/* BARRA DE BÚSQUEDA ANIMADA */}
          <div
            className={`relative transition-all duration-300 ease-in-out ${
              showMobileSearch
                ? "flex-1 opacity-100 translate-x-0"
                : "w-0 md:w-96 opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto"
            }`}
          >
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="¿Qué buscas hoy?"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              // Evitamos que el scroll del body se active al enfocar en mobile
              onFocus={(e) =>
                e.target.scrollIntoView({ behavior: "smooth", block: "center" })
              }
              className="w-full pl-11 pr-12 py-2.5 border border-gray-200 rounded-2xl text-sm bg-white shadow-sm outline-none focus:border-primary transition-all"
            />

            {/* BOTÓN CERRAR (Solo oculta, no borra el texto) */}
            <button
              type="button"
              onClick={() => setShowMobileSearch(false)}
              className="md:hidden absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full text-gray-500"
            >
              <X size={14} />
            </button>
          </div>

          {/* 3. ICONOS DE ACCIÓN (Mobile) */}
          <div
            className={`flex items-center gap-1.5 transition-all duration-300 ${
              showMobileSearch
                ? "opacity-0 scale-90 pointer-events-none hidden"
                : "opacity-100 scale-100"
            } md:hidden`}
          >
            {/* Botón Lupa: Si hay búsqueda previa, le ponemos un punto azul */}
            <button
              type="button"
              onClick={() => setShowMobileSearch(true)}
              className="relative p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 shadow-sm"
            >
              <Search size={20} />
              {search && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
              )}
            </button>
            <button
              type="button"
              onClick={onOpenFilters}
              className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 shadow-sm"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
