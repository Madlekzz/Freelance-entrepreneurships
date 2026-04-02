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
  if (!user) return null;

  const mainRoleLabel = roles.length > 1 ? "Multitarea" : roles[0] || "Usuario";

  return (
    <aside className="group w-17 hover:w-60 bg-primary flex flex-col shrink-0 h-screen top-0 transition-all duration-300 ease-in-out z-50 shadow-2xl border-r border-white/10 relative overflow-hidden">
      {/* ── Decorative Background (Identical to Login) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full border border-white/5 -top-20 -right-20" />
        <div className="absolute w-40 h-40 rounded-full border border-white/5 top-1/2 -left-20 -translate-y-1/2" />
        <div className="absolute w-32 h-32 rounded-full border border-white/5 -bottom-10 -right-10" />
        <div className="absolute w-12 h-12 rounded-full bg-white/5 top-20 left-10" />
      </div>

      {/* ── Brand Section ── */}
      <div className="relative px-4 py-6 border-b border-white/10 overflow-hidden shrink-0 bg-primary/20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Link
              to="/dashboard"
              className="w-10 h-10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 hover:opacity-80 active:scale-95"
              title="Ir al inicio del Dashboard"
            >
              <img
                src={freelanceLogo}
                alt="Freelance Latin America Logo"
                className="w-8 h-8 object-contain"
              />
            </Link>
          </div>
          <div className="min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
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
              onClick={() => onNavigate(item.id)}
              className={`group/item cursor-pointer relative flex items-center h-10 rounded-xl transition-all duration-200 w-full shrink-0 ${
                isActive
                  ? "bg-white/20 text-white shadow-lg backdrop-blur-md"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 w-1 h-4 bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
              )}

              <div className="w-11 group-hover:w-9 flex items-center justify-center shrink-0 transition-all duration-300">
                <span
                  className={`${isActive ? "scale-110 text-white" : "group-hover/item:scale-110 text-white/70 group-hover/item:text-white"} transition-transform duration-200`}
                >
                  <Icon size={16} />
                </span>
              </div>

              <span className="flex-1 text-sm text-start font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── User Section (Footer) ── */}
      <div className="relative p-3 border-t border-white/10 bg-black/10 backdrop-blur-md overflow-hidden shrink-0">
        <div className="flex items-center gap-3 h-10">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
            {user.initials}
          </div>
          <div className="min-w-0 flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            <p className="text-[0.8125rem] font-bold text-white truncate">
              {user.name}
            </p>
            <p className="text-[0.65rem] text-white/40 truncate italic font-medium">
              {roles.join(" • ")}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
