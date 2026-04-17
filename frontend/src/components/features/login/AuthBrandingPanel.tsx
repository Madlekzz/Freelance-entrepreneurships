import { useNavigate } from "react-router-dom";
import freelanceLogo from "../../../assets/Isotipo FLA-Blanco.png";

interface AuthBrandingPanelProps {
  subtitle?: React.ReactNode;
  features?: string[]; // Nueva prop para las listas del login
  statusText?: string;
}

export const AuthBrandingPanel = ({
  subtitle,
  features,
  statusText,
}: AuthBrandingPanelProps) => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex w-[45%] bg-primary flex-col justify-between gap-4 p-10 relative overflow-hidden shrink-0">
      {/* Círculos decorativos */}
      <div className="absolute w-96 h-96 rounded-full border border-white/10 -top-24 -right-28 pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full border border-white/10 -bottom-20 -left-24 pointer-events-none" />
      <div className="absolute w-32 h-32 rounded-full border border-white/10 top-1/2 right-10 -translate-y-1/2 pointer-events-none" />

      <div className="relative">
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={freelanceLogo}
            alt="Logo"
            className="h-10 w-auto object-contain mb-6"
          />
        </button>
        <h1 className="font-display text-[2.25rem] font-bold text-white leading-tight mb-4">
          Freelance
          <br />
          Latin America
        </h1>
        {subtitle && (
          <p className="text-white/55 text-sm leading-relaxed">{subtitle}</p>
        )}
      </div>

      <div className="relative flex flex-col gap-3">
        {/* Renderizado condicional de features (Login) o statusText (Reset/Forgot) */}
        {features
          ? features.map((feat) => (
              <div key={feat} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="text-white/70 text-sm">{feat}</span>
              </div>
            ))
          : statusText && (
              <div className="flex items-center gap-2.5 text-white/70 text-sm">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                {statusText}
              </div>
            )}
        <p className="text-white/25 text-xs mt-4">
          © 2026 Freelance Latin America
        </p>
      </div>
    </div>
  );
};
