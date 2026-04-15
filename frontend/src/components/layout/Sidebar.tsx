import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import freelanceLogo from "../../assets/Isotipo FLA-Blanco.png";
import type { MenuItem, SidebarUser } from "../../types";

interface Props {
  roles: string[];
  navConfig: MenuItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  user: SidebarUser | null;
}

export default function Sidebar({
  roles,
  navConfig,
  activeId,
  onNavigate,
  user,
}: Props) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Manejo de Swipe para abrir/cerrar
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) =>
      setTouchStart(e.targetTouches[0].clientX);
    const handleTouchMove = (e: TouchEvent) => {
      if (touchStart === null) return;
      const currentTouch = e.targetTouches[0].clientX;
      const diff = touchStart - currentTouch;

      // Swipe a la derecha (abrir)
      if (diff < -50 && touchStart < 40) setIsOpenMobile(true);
      // Swipe a la izquierda (cerrar)
      if (diff > 50 && isOpenMobile) setIsOpenMobile(false);
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [touchStart, isOpenMobile]);

  if (!user) return null;

  const mainRoleLabel = roles.length > 1 ? "Multitarea" : roles[0] || "Usuario";

  return (
    <>
      {/* ── Indicador / Botón Flotante (Solo Mobile) ── */}
      {!isOpenMobile && (
        <button
          type="button"
          onClick={() => setIsOpenMobile(true)}
          className="md:hidden fixed left-0 top-1/2 -translate-y-1/2 z-60 bg-primary text-white py-4 rounded-r-2xl shadow-lg border-y border-r border-white/20 animate-pulse"
        >
          <ChevronRight size={20} />
        </button>
      )}

      {/* ── Overlay (Fondo oscuro al abrir en mobile) ── */}
      {isOpenMobile && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-55 md:hidden transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed md:relative top-0 bottom-0 left-0 z-60
          flex flex-col shrink-0 h-screen group transition-all duration-300 ease-in-out
          bg-primary shadow-2xl border-r border-white/10 overflow-hidden
          ${isOpenMobile ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 w-0 md:w-17 md:hover:w-60"}
        `}
      >
        {/* ── Decorative Background ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-64 h-64 rounded-full border border-white/5 -top-20 -right-20" />
          <div className="absolute w-40 h-40 rounded-full border border-white/5 top-1/2 -left-20 -translate-y-1/2" />
        </div>

        {/* ── Brand Section ── */}
        <div className="relative px-4 py-6 border-b border-white/10 overflow-hidden shrink-0 bg-primary/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 md:group-hover:scale-110 transition-transform duration-300">
              <Link
                to="/dashboard"
                onClick={() => setIsOpenMobile(false)}
                className="w-10 h-10 flex items-center justify-center"
              >
                <img
                  src={freelanceLogo}
                  alt="Logo"
                  className="w-8 h-8 object-contain"
                />
              </Link>
            </div>
            {/* Visible si está abierto en mobile o hover en desktop */}
            <div
              className={`min-w-0 transition-opacity duration-300 whitespace-nowrap ${isOpenMobile ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"}`}
            >
              <p className="font-display text-sm font-bold text-white leading-tight">
                Freelance Latin America
              </p>
              <p className="text-[0.65rem] text-white/50 mt-px uppercase tracking-widest font-semibold">
                {mainRoleLabel}
              </p>
            </div>
          </div>
        </div>

        {/* ── Navigation Section ── */}
        <nav className="relative flex-1 px-3 py-6 flex flex-col gap-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navConfig.map((item) => {
            const isActive = activeId === item.id;
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpenMobile(false); // Cerrar al navegar
                }}
                className={`group/item flex items-center cursor-pointer h-10 rounded-xl transition-all duration-200 w-full shrink-0 ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/60 md:hover:bg-white/10"
                }`}
              >
                <div className="w-11 flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <span
                  className={`flex-1 text-sm text-start font-medium whitespace-nowrap transition-[opacity,visibility] ${isOpenMobile ? "opacity-100 visible duration-300" : "opacity-0 invisible duration-0 delay-0 group-hover:opacity-100 group-hover:visible"}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ── User Section ── */}
        <div className="relative p-3 border-t border-white/10 bg-black/10 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 h-10">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user.initials}
            </div>
            <div
              className={`min-w-0 flex-1 transition-opacity duration-300 ${isOpenMobile ? "opacity-100" : "opacity-0 md:group-hover:opacity-100"}`}
            >
              <p className="text-[0.8125rem] font-bold text-white truncate">
                {user.name}
              </p>
              <p className="text-[0.65rem] text-white/40 truncate italic">
                {roles.join(" • ")}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
