import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import freelanceLogo from "../assets/Isotipo FLA-Blanco.png";
import { supabase } from "../config/supabaseClient";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          // Asegúrate de que esta URL esté en tu Whitelist de Supabase
          redirectTo:
            "https://freelance-entrepreneurships-fronten.vercel.app/reset-password",
        },
      );

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al enviar el correo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-xl min-h-150">
        {/* ── Panel Izquierdo (Branding) ── */}
        <div className="hidden md:flex w-[45%] bg-primary flex-col justify-between gap-4 p-10 relative overflow-hidden shrink-0">
          <div className="absolute w-96 h-96 rounded-full border border-white/10 -top-24 -right-28 pointer-events-none" />
          <div className="absolute w-64 h-64 rounded-full border border-white/10 -bottom-20 -left-24 pointer-events-none" />

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
            <p className="text-white/55 text-sm leading-relaxed">
              Recuperación de acceso y
              <br />
              seguridad de cuenta
            </p>
          </div>

          <div className="relative flex flex-col gap-3">
            <div className="flex items-center gap-2.5 text-white/70 text-sm">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              Proceso verificado por IT
            </div>
            <p className="text-white/25 text-xs mt-4">
              © 2026 Freelance Latin America
            </p>
          </div>
        </div>

        {/* ── Panel Derecho (Formulario) ── */}
        <div className="flex-1 bg-white flex items-center justify-center px-8 py-12 md:px-12">
          <div className="w-full max-w-sm">
            {/* Mobile Logo */}
            <div className="flex items-center gap-2 mb-8 md:hidden">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center" />
              <span className="font-display font-semibold text-gray-900">
                Freelance <span className="text-primary">LA</span>
              </span>
            </div>

            {success ? (
              <div className="text-center animate-in fade-in zoom-in duration-500">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  ¡Correo enviado!
                </h2>
                <p className="text-gray-500 mb-8 text-sm">
                  Hemos enviado un enlace de recuperación a{" "}
                  <strong>{email}</strong>. Por favor, revisa tu bandeja de
                  entrada y spam.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold hover:bg-primary-dark transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    ¿Olvidaste tu contraseña?
                  </h2>
                  <p className="text-gray-500 text-sm mt-2">
                    No te preocupes. Ingresa tu correo y te enviaremos
                    instrucciones para restablecerla.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-lg">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider"
                    >
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none text-sm"
                        placeholder="ejemplo@freelance.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Enviar enlace de recuperación"
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Volver al login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
