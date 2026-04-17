import { LogOut } from "lucide-react";
import { useAuth } from "../features/login/hooks/useAuth"; // Importamos nuestro nuevo hook

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { logout } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 h-16 flex items-center justify-between shrink-0 sticky top-0 z-40 gap-8 md:gap-0">
      {/* ── Left Side: Title & Navigation ── */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex flex-col truncate">
          <h2 className="font-display md:text-lg text-md font-bold text-gray-900 leading-tight tracking-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="md:text-sm text-[10px] font-medium text-gray-400 uppercase tracking-wider truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── Right Side: Actions & Logout ── */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={logout}
          aria-label="Cerrar sesión"
          className="group flex cursor-pointer items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-red-100 active:scale-95"
        >
          <LogOut
            size={18}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
        </button>
      </div>
    </header>
  );
}
