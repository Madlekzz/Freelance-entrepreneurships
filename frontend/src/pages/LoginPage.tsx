import { useState } from "react";
import { useNavigate } from "react-router-dom";
import freelanceLogo from "../assets/Isotipo FLA-Blanco.png";
import LoginForm from "../components/ui/login/LoginForm";
import RegisterForm from "../components/ui/login/RegisterForm";

// ── Types ─────────────────────────────────────────────────────────────────────

type AuthMode = "login" | "register";

// ── Component ─────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-xl">
        {/* ── Left panel ── */}
        <div className="hidden md:flex w-[45%] bg-primary flex-col justify-between gap-4 p-10 relative overflow-hidden shrink-0">
          {/* Decorative circles */}
          <div className="absolute w-96 h-96 rounded-full border border-white/10 -top-24 -right-28 pointer-events-none" />
          <div className="absolute w-64 h-64 rounded-full border border-white/10 -bottom-20 -left-24 pointer-events-none" />
          <div className="absolute w-32 h-32 rounded-full border border-white/10 top-1/2 right-10 -translate-y-1/2 pointer-events-none" />
          <div className="absolute w-16 h-16 rounded-full bg-white/5 bottom-32 right-28 pointer-events-none" />

          {/* Brand */}
          <div className="relative">
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={freelanceLogo}
                alt="Logo de Freelance Latin America"
                className="h-10 w-auto object-contain mb-6"
              />
            </button>

            <h1 className="font-display text-[2.25rem] font-bold text-white leading-tight mb-4">
              Freelance
              <br />
              Latin America
            </h1>
            <p className="text-white/55 text-sm leading-relaxed">
              Plataforma interna de gestión
              <br />
              de emprendimientos
            </p>
          </div>

          {/* Feature pills */}
          <div className="relative flex flex-col gap-3">
            {[
              "Catálogo de productos interno",
              "Gestión de emprendimientos",
              "Descuentos por nómina",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="text-white/70 text-sm">{feat}</span>
              </div>
            ))}
            <p className="text-white/25 text-xs mt-4">
              © 2025 Freelance Latin America
            </p>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="flex-1 bg-white flex items-center justify-center px-8 py-12 md:px-12">
          <div className="w-full max-w-sm">
            {/* Mobile brand */}
            <div className="flex items-center gap-2 mb-8 md:hidden">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <div className="w-3.5 h-3.5 bg-white rounded-sm" />
              </div>
              <span className="font-display font-semibold text-gray-900">
                Freelance <span className="text-primary">Latin America</span>
              </span>
            </div>

            {/* Mode toggle */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
              {(["login", "register"] as AuthMode[]).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    mode === m
                      ? "bg-white text-primary shadow-sm"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {m === "login" ? "Iniciar sesión" : "Registrarse"}
                </button>
              ))}
            </div>

            {mode === "login" ? <LoginForm /> : <RegisterForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
