import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";

interface Props {
  title: string;
  subtitle: string;
}

export default function Topbar({ title, subtitle }: Props) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 h-16 flex items-center justify-between shrink-0 sticky top-0 z-40">
      {/* ── Left Side: Title & Navigation ── */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h2 className="font-display text-lg font-bold text-gray-900 leading-tight tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[0.75rem] font-medium text-gray-400 uppercase tracking-wider">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── Right Side: Actions & Logout ── */}
      <div className="flex items-center gap-3">
        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          title="Cerrar sesión"
          className="group flex cursor-pointer items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-red-200 active:scale-90"
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
