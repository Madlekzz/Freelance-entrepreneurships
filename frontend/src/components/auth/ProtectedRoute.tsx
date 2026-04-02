import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "../../config/supabaseClient";
import type { UserRole } from "../../types";
import type { User } from "@supabase/supabase-js";

export default function ProtectedRoute() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      // Forzamos la obtención de la sesión fresca
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        // Si el evento es INITIAL_SESSION o SIGNED_IN, nos aseguramos de tener el user
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-gray-400">Verificando acceso...</div>
      </div>
    );
  }

  if (!user) {
    // Guardamos la ruta a la que intentaba ir para volver después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Extraemos roles con mayor cobertura
  const metadata = user.user_metadata || {};
  const rawRoles = metadata.role || metadata.roles || [];
  const roles = (Array.isArray(rawRoles) ? rawRoles : [rawRoles]) as UserRole[];

  const validRoles: UserRole[] = ["IT", "ADMIN", "PROVEEDOR", "CONSUMIDOR"];
  const hasAnyRole = roles.some((r) => validRoles.includes(r));

  if (!hasAnyRole) {
    console.warn(
      "Acceso denegado: Metadata insuficiente en la sesión actual",
      roles,
    );
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
