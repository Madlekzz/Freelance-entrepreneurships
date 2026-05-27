import { Dropdown } from "antd";
import { ChevronDown, Filter, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import SearchInput from "../../shared/SearchInput";

interface Props {
  view: "summary" | "detailed";
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: "all" | "pending" | "processed" | "refunded") => void;
  exportButton?: ReactNode;
}

export const ConsumersFilters = ({
  view,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  exportButton,
}: Props) => (
  <div className="flex flex-col lg:flex-row gap-3 items-center bg-white p-4 rounded-4xl md:rounded-2xl border border-gray-100 shadow-sm">
    <SearchInput
      value={searchQuery}
      onChange={setSearchQuery}
      placeholder={
        view === "summary"
          ? "Buscar por nombre o correo..."
          : "Buscar por producto o ID..."
      }
    />

    {view === "detailed" && (
      <div className="flex gap-2 w-full lg:w-auto">
        <div className="col-span-1 lg:w-48">
          <Dropdown
            menu={{
              items: [
                {
                  key: "all",
                  label: "Todos los estados",
                  onClick: () => setStatusFilter("all"),
                },
                { type: "divider" },
                {
                  key: "pending",
                  label: "Pendientes",
                  onClick: () => setStatusFilter("pending"),
                },
                {
                  key: "processed",
                  label: "Procesados",
                  onClick: () => setStatusFilter("processed"),
                },
                {
                  key: "refunded",
                  label: "Reembolsadas",
                  onClick: () => setStatusFilter("refunded"),
                },
              ],
            }}
            trigger={["click"]}
          >
            <button
              type="button"
              className="w-full flex items-center justify-between gap-2 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <Filter size={16} className="text-primary shrink-0" />
                <span className="truncate">
                  {statusFilter === "all"
                    ? "Todos los estados"
                    : statusFilter === "pending"
                      ? "Pendientes"
                      : statusFilter === "refunded"
                        ? "Reembolsadas"
                        : "Procesados"}
                </span>
              </div>
              <ChevronDown size={14} className="text-gray-400 shrink-0" />
            </button>
          </Dropdown>
        </div>
        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
          }}
          className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all cursor-pointer border border-gray-100 lg:border-none"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    )}

    {exportButton}
  </div>
);
