import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../../config/supabaseClient";
import { loginUser } from "../../../../services/authService";
import type { LoginFormType } from "../../../../types";

export function useLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginFormType>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField =
    (key: keyof LoginFormType) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Llamada al servicio (API personalizada)
      const data = await loginUser(form);

      // 2. Sincronizar con el cliente local de Supabase
      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });

      if (sessionError) throw sessionError;

      // 3. Lógica de redirección por Roles
      const currentUser = sessionData.user;
      const roles: string[] =
        currentUser?.user_metadata?.role ??
        currentUser?.user_metadata?.roles ??
        [];

      const hasDashboardAccess = roles.some((role) =>
        ["IT", "ADMIN", "PROVEEDOR", "CONSUMIDOR"].includes(role),
      );

      const targetPath = hasDashboardAccess ? "/dashboard" : "/";
      navigate(targetPath, { replace: true });
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

  return {
    form,
    loading,
    error,
    showPassword,
    updateField,
    togglePasswordVisibility,
    handleLogin,
  };
}
