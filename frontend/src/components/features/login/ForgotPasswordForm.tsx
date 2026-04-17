import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  hook: ReturnType<
    typeof import("../../../hooks/useForgotPassword").useForgotPassword
  >;
}

export const ForgotPasswordForm = ({ hook }: Props) => {
  const navigate = useNavigate();
  const { email, setEmail, loading, error, success, handleSubmit } = hook;

  if (success) {
    return (
      <div className="text-center animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Correo enviado!
        </h2>
        <p className="text-gray-500 mb-8 text-sm">
          Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
          Revisa tu bandeja de entrada y spam.
        </p>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold hover:bg-primary-dark transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
        >
          Volver al inicio de sesión
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          No te preocupes. Ingresa tu correo y te enviaremos instrucciones para
          restablecerla.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-lg italic">
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
              id="email"
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
  );
};
