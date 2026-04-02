import axios from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../config/supabaseClient";
import { loginUser } from "../../../services/authService";
import type { LoginForm } from "../../../types";

export default function LoginForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [showPassword, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Llamada al servicio (tu API personalizada)
      const data = await loginUser(form);

      // 2. Sincronizar con el cliente local de Supabase
      // Esto es vital para que 'ProtectedRoute' y el resto de la app reconozcan la sesión
      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

      if (sessionError) throw sessionError;

      /**
       * CORRECCIÓN CRUCIAL:
       * No confíes solo en 'data.user' de la respuesta de tu API.
       * Confía en lo que el cliente de Supabase acaba de registrar.
       */
      const currentUser = sessionData.user;
      const roles: string[] =
        currentUser?.user_metadata?.role ??
        currentUser?.user_metadata?.roles ??
        [];

      const hasDashboardAccess = roles.some((role) =>
        ["IT", "ADMIN", "PROVEEDOR", "CONSUMIDOR"].includes(role),
      );

      // 3. Redirección con un pequeño respiro (opcional pero recomendado)
      // O simplemente navegar sabiendo que la sesión ya está en el SDK
      if (hasDashboardAccess) {
        // replace: true evita que el usuario vuelva al login con el botón "atrás"
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      let message = "Error al conectar con el servidor";

      if (axios.isAxiosError(err)) {
        const backendError = err.response?.data as { error?: string };
        message = backendError?.error || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(
        message === "Invalid login credentials"
          ? "Correo o contraseña incorrectos"
          : message,
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-primary transition-colors placeholder:text-gray-300";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">
          Bienvenido de vuelta
        </h2>
        <p className="text-sm text-gray-400">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Correo electrónico
          </label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={set("email")}
            disabled={loading}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1.5">
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={set("password")}
              disabled={loading}
              required
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
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
        <span className="text-primary cursor-pointer hover:underline">
          ¿Olvidaste tu contraseña?
        </span>
      </p>
    </form>
  );
}
