import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useLogin } from "./hooks/useLogin"; // Ajusta la ruta

export default function LoginForm() {
  const {
    form,
    loading,
    error,
    showPassword,
    updateField,
    togglePasswordVisibility,
    handleLogin,
  } = useLogin();

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-primary transition-colors placeholder:text-gray-300 disabled:bg-gray-50";

  return (
    <form onSubmit={handleLogin} noValidate className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">
          Bienvenido de vuelta
        </h2>
        <p className="text-sm text-gray-400">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600 mb-1.5"
          >
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={updateField("email")}
            disabled={loading}
            required
            className={inputClass}
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600 mb-1.5"
          >
            Contraseña
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={updateField("password")}
              disabled={loading}
              required
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 cursor-pointer bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Verificando...
          </>
        ) : (
          "Iniciar sesión"
        )}
      </button>

      <p className="text-center text-xs text-gray-400">
        <Link
          to="/forgot-password"
          className="text-primary cursor-pointer hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
    </form>
  );
}
