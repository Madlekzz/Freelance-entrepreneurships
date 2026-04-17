import { useState } from "react";
import { supabase } from "../config/supabaseClient";

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
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

  return {
    email,
    setEmail,
    loading,
    error,
    success,
    handleSubmit,
  };
}
