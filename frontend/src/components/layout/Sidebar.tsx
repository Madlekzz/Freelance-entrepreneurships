import { ChevronRight, Loader2, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import freelanceLogo from "../../assets/Isotipo FLA-Blanco.png";
import { useSidebar } from "../../hooks/useSidebar";
import type { MenuItem } from "../../types";
import { getRoleLabel, getUserInitials } from "../../utils/userUtils";
import { useAuth } from "../features/login/hooks/useAuth";
import { useSoftwareUpdates } from "../../hooks/useSoftwareUpdates";
import { getCategoryIcon } from "./SoftwareUpdatesWidget";
import { useState } from "react";
import UpdatesModal from "../shared/UpdatesModal";

interface SidebarProps {
  navConfig: MenuItem[];
  activeId: string;
  onNavigate: (id: string) => void;
}

export default function Sidebar({
  navConfig,
  activeId,
  onNavigate,
}: SidebarProps) {
  const { user, roles } = useAuth();
  const { isOpenMobile, closeMobile, openMobile } = useSidebar();
  const { updates, loading, unreadCount, markAsRead } = useSoftwareUpdates();
  const [updatesModalOpen, setUpdatesModalOpen] = useState(false);

  if (!user) return null;

  const initials = getUserInitials(user.user_metadata?.name);
  const mainRoleLabel = getRoleLabel(roles);

  return (
    <>
      {/* Overlay Mobile */}
      {isOpenMobile && (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-55 md:hidden transition-opacity cursor-pointer"
          onClick={closeMobile}
        />
      )}

      {/* Botón Flotante Mobile */}
      {!isOpenMobile && (
        <button
          type="button"
          onClick={openMobile}
          aria-label="Abrir menú de navegación"
          className="md:hidden fixed left-0 top-1/2 -translate-y-1/2 z-60 bg-primary text-white py-4 rounded-r-2xl shadow-lg border-y border-r border-white/20 animate-pulse"
        >
          <ChevronRight size={20} />
        </button>
      )}

      <aside
        className={`
          fixed md:relative top-0 bottom-0 left-0 z-60
          flex flex-col shrink-0 h-screen group transition-all duration-300 ease-in-out
          bg-primary shadow-2xl border-r border-white/10
          overflow-x-hidden overflow-y-auto custom-scrollbar
          ${isOpenMobile ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 w-0 md:w-17 md:hover:w-60"}
        `}
      >
        {/* Decorative Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-64 h-64 rounded-full border border-white/5 -top-20 -right-20" />
        </div>

        {/* Brand Section */}
        {/* Añadimos w-60 o w-64 fijo al div interno para que el contenido no intente ajustarse al ancho variable del padre */}
        <div className="relative px-4 py-6 border-b border-white/10 shrink-0 bg-primary/20 backdrop-blur-sm w-60">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              onClick={closeMobile}
              className="w-10 h-10 flex items-center justify-center shrink-0"
            >
              <img
                src={freelanceLogo}
                alt="Freelance Latin America"
                className="w-8 h-8 object-contain"
              />
            </Link>
            <div
              className={`min-w-0 transition-opacity duration-300 whitespace-nowrap ${isOpenMobile ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"}`}
            >
              <p className="font-display text-sm font-bold text-white truncate leading-tight">
                Freelance Latin America
              </p>
              <p className="text-[0.65rem] text-white/50 mt-px uppercase tracking-widest font-semibold">
                {mainRoleLabel}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 px-3 py-6 flex flex-col gap-1 w-60">
          {navConfig.map((item) => {
            const isActive = activeId === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  closeMobile();
                }}
                className={`flex items-center cursor-pointer h-10 rounded-xl transition-all duration-200 w-full shrink-0 ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/60 md:hover:bg-white/10"
                }`}
              >
                <div className="w-11 flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <span
                  className={`flex-1 text-sm text-start font-medium whitespace-nowrap transition-opacity ${isOpenMobile ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Software Updates Widget - Collapsed Circle + Expanded Bubble */}
        <div className="relative px-3 py-3 shrink-0 w-60">
          {/* Collapsed circle — always visible */}
          <div className="flex items-center justify-start md:justify-center md:group-hover:hidden">
            <button
              type="button"
              onClick={() => setUpdatesModalOpen(true)}
              className="w-11 h-10 flex items-center justify-center"
              title="Novedades"
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center relative">
                <Megaphone size={14} className="text-primary" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Expanded bubble — visible on hover (desktop) or always on mobile */}
          <div className="hidden md:group-hover:block">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Novedades
                </h4>
                {unreadCount > 0 && (
                  <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-3">
                  <Loader2 size={14} className="animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  <div className="space-y-1.5 max-h-28 overflow-y-auto mb-2">
                    {updates.slice(0, 3).map((update) => (
                      <div key={update.id} className="flex gap-2 items-start">
                        <div className="mt-0.5">{getCategoryIcon(update.category)}</div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-gray-900 truncate">
                            {update.title}
                          </p>
                        </div>
                      </div>
                    ))}
                    {updates.length === 0 && (
                      <p className="text-[11px] text-gray-400 italic">
                        Sin novedades
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setUpdatesModalOpen(true)}
                    className="w-full py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition-colors cursor-pointer"
                  >
                    Ver novedades
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* User Info Section */}
        <div className="relative p-3 border-t border-white/10 bg-black/10 backdrop-blur-md shrink-0 w-60">
          <div className="flex items-center gap-3 h-10">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {initials}
            </div>
            <div
              className={`min-w-0 flex-1 transition-opacity duration-300 ${isOpenMobile ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"}`}
            >
              <p className="text-[0.8125rem] font-bold text-white truncate">
                {user.user_metadata?.name || "Usuario"}
              </p>
              <p className="text-[0.65rem] text-white/40 truncate italic">
                {roles.join(" • ")}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Updates Modal — outside <aside> to avoid fixed-position containing block issues */}
      <UpdatesModal
        isOpen={updatesModalOpen}
        onClose={() => setUpdatesModalOpen(false)}
        updates={updates}
        loading={loading}
        onMarkAsRead={markAsRead}
      />
    </>
  );
}
