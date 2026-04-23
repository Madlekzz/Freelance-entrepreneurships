import { ChevronRight, Filter, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { SortOption } from "../../../hooks/useCatalog";
import type { Category } from "../../../types";

interface Props {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (val: string | null) => void;
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
  hideOutOfStock: boolean;
  setHideOutOfStock: (val: boolean | ((prev: boolean) => boolean)) => void;
  clearFilters: () => void;
  hasFilters: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CatalogSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  hideOutOfStock,
  setHideOutOfStock,
  clearFilters,
  hasFilters,
  isOpen,
  onClose,
}: Props) {
  const [isSortOpen, setIsSortOpen] = useState(true);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);

  // Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const orderFilters = [
    { id: "name-asc", label: "Alfabético: A - Z" },
    { id: "name-desc", label: "Alfabético: Z - A" },
    { id: "price-asc", label: "Precio: Menor a Mayor" },
    { id: "price-desc", label: "Precio: Mayor a Menor" },
  ];

  // ÚNICAMENTE los bloques de filtros
  const filterSections = (
    <div className="space-y-2">
      {/* Ordenar */}
      <div className="border-b border-gray-100 pb-2">
        <button
          type="button"
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="cursor-pointer flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-700 hover:text-primary transition-colors group"
        >
          <span>Ordenar por</span>
          <ChevronRight
            size={16}
            className={`transition-transform duration-200 ${isSortOpen ? "rotate-90" : ""} text-gray-400 group-hover:text-primary`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${isSortOpen ? "max-h-60 opacity-100 mb-4" : "max-h-0 opacity-0"}`}
        >
          <div className="flex flex-col gap-1 ml-2">
            {orderFilters.map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => {
                  setSortBy(option.id as SortOption);
                  if (window.innerWidth < 768) onClose?.();
                }}
                className={`cursor-pointer text-left px-4 py-2 rounded-lg text-sm transition-all ${sortBy === option.id ? "bg-primary/10 text-primary font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Categorías */}
      <div className="border-b border-gray-100 pb-2">
        <button
          type="button"
          onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
          className="cursor-pointer flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-700 hover:text-primary transition-colors group"
        >
          <span>Categorías</span>
          <ChevronRight
            size={16}
            className={`transition-transform duration-200 ${isCategoriesOpen ? "rotate-90" : ""} text-gray-400 group-hover:text-primary`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${isCategoriesOpen ? "max-h-60 opacity-100 mb-4" : "max-h-0 opacity-0"}`}
        >
          <div className="flex flex-col gap-1 ml-2 py-2">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                if (window.innerWidth < 768) onClose?.();
              }}
              className={`cursor-pointer text-left px-4 py-2 rounded-lg text-sm transition-all ${selectedCategory === null ? "bg-primary/10 text-primary font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
            >
              Todas las categorías
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category.id}
                onClick={() => {
                  setSelectedCategory(String(category.id));
                  if (window.innerWidth < 768) onClose?.();
                }}
                className={`cursor-pointer text-left px-4 py-2 rounded-lg text-sm transition-all ${selectedCategory === String(category.id) ? "bg-primary/10 text-primary font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stock */}
      <div className="border-b border-gray-100 pb-4 pt-2">
        <label className="flex items-center justify-between cursor-pointer group">
          <span className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors">
            Ocultar sin stock
          </span>
          <button
            type="button"
            onClick={() => setHideOutOfStock((v) => !v)}
            className={`w-10 h-5 rounded-full relative transition-colors ${hideOutOfStock ? "bg-primary" : "bg-gray-200"}`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${hideOutOfStock ? "translate-x-5" : "translate-x-0.5"}`}
            />
          </button>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* VISTA DESKTOP */}
      <aside className="hidden md:block w-64 shrink-0">
        <div className="sticky top-24">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Filter size={20} className="text-primary" />
            Filtros
          </h2>
          {filterSections}
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-8 w-full py-2.5 text-xs font-bold text-primary uppercase tracking-widest border border-primary/20 rounded-xl hover:bg-primary hover:text-white transition-all"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </aside>

      {/* VISTA MOBILE */}
      <div
        className={`fixed inset-0 z-70 md:hidden transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}
      >
        {/* Overlay */}
        <button
          type="button"
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
          onClick={onClose}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Header Mobile */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Filter size={20} className="text-primary" />
              Filtros
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors active:scale-90"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Contenido Animado */}
          <div
            className={`flex-1 overflow-y-auto p-6 transition-all duration-500 delay-100 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {filterSections}

            {hasFilters && (
              <button
                type="button"
                onClick={() => {
                  clearFilters();
                  onClose?.();
                }}
                className="mt-8 w-full py-3 bg-white border-2 border-primary/20 text-primary font-bold rounded-2xl active:bg-primary active:text-white transition-all uppercase tracking-widest text-xs"
              >
                Limpiar todo
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
