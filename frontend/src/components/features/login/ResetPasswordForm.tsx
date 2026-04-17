import { CheckCircle2, Eye, EyeOff, Loader2, Lock } from "lucide-react";

interface Props {
  hook: ReturnType<
    typeof import("../../../hooks/useResetPassword").useResetPassword
  >;
}

export const ResetPasswordForm = ({ hook }: Props) => {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    loading,
    error,
    success,
    handleSubmit,
  } = hook;

  if (success) {
    return (
      <div className="text-center animate-in zoom-in duration-300">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Todo listo!</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Tu contraseña ha sido configurada. Redirigiendo...
        </p>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-green-500 h-full animate-progress-bar"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Configura tu acceso
        </h2>
        <p className="text-gray-500 text-sm mt-2">
          Ingresa una contraseña segura para tu nueva cuenta.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-lg italic">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input Nueva Contraseña */}
        <div className="space-y-1">
          <label
            htmlFor="new-password"
            className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider"
          >
            Nueva Contraseña
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none text-sm"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Input Confirmar */}
        <div className="space-y-1">
          <label
            htmlFor="confirm-password"
            className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider"
          >
            Confirmar
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all outline-none text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Activar Mi Cuenta"
          )}
        </button>
      </form>
    </div>
  );
};
