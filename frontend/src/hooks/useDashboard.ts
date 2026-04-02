import {
  BriefcaseBusiness,
  Handbag,
  ShoppingBag,
  ShoppingBasket,
  Store,
  UserCheck,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Añadimos useLocation
import { supabase } from "../config/supabaseClient";
import type { MenuItem, SidebarUser, UserRole } from "../types";

export const useDashboard = () => {
  const [user, setUser] = useState<SidebarUser | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation(); // Para saber dónde estamos parados

  // 1. Definimos los items con sus rutas correspondientes
  const MENU_ITEMS: MenuItem[] = useMemo(
    () => [
      {
        id: "signupRequests",
        label: "Solicitudes de registro",
        icon: UserCheck,
        roles: ["IT"],
        path: "/dashboard/requests",
      },
      {
        id: "systemUsers",
        label: "Usuarios del Sistema",
        icon: UserRound,
        roles: ["IT"],
        path: "/dashboard/users",
      },
      {
        id: "purchases",
        label: "Mis consumos",
        icon: ShoppingBasket,
        roles: ["CONSUMIDOR"],
        path: "/dashboard/purchases",
      },
      {
        id: "entrepreneurships",
        label: "Mis emprendimientos",
        icon: Store,
        roles: ["PROVEEDOR"],
        path: "/dashboard/entrepreneurships",
      },
      {
        id: "entrepreneurs",
        label: "Emprendedores",
        icon: BriefcaseBusiness,
        roles: ["ADMIN"],
        path: "/dashboard/entrepreneurs",
      },
      {
        id: "consumers",
        label: "Consumidores",
        icon: Handbag,
        roles: ["ADMIN"],
        path: "/dashboard/consumers",
      },
      {
        id: "catalog",
        label: "Ir al catálogo",
        icon: ShoppingBag,
        roles: ["IT", "ADMIN", "PROVEEDOR", "CONSUMIDOR"],
        path: "/", // Ruta pública
      },
    ],
    [],
  );

  // 2. Determinamos qué pestaña está activa basándonos en la URL actual
  const activeTab = useMemo(() => {
    const currentItem = MENU_ITEMS.find(
      (item) =>
        location.pathname.startsWith(item.path || "") && item.path !== "/",
    );
    // Caso especial para el catálogo o si no encuentra nada
    if (location.pathname === "/") return "catalog";
    return currentItem?.id || "";
  }, [location.pathname, MENU_ITEMS]);

  // 3. Navegación simplificada
  const handleNavigation = (id: string) => {
    const item = MENU_ITEMS.find((i) => i.id === id);
    if (item?.path) {
      navigate(item.path);
    }
  };

  useEffect(() => {
    const fetchUserAndRoles = async () => {
      try {
        setLoading(true);
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) throw authError;

        const metadata = authUser.user_metadata;
        const rawRoles = metadata.roles || metadata.role || [];
        const normalizedRoles: UserRole[] = Array.isArray(rawRoles)
          ? rawRoles
          : [rawRoles];

        setRoles(normalizedRoles);

        setUser({
          id: authUser.id,
          name: metadata.name || authUser.email || "Usuario",
          initials: metadata.name
            ? metadata.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
            : "U",
          role: normalizedRoles.join(" • "),
        });
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRoles();
  }, []);

  const navConfig = useMemo(() => {
    return MENU_ITEMS.filter((item) =>
      item.roles.some((role) => roles.includes(role)),
    );
  }, [roles, MENU_ITEMS]);

  return {
    activeTab, // Ahora es dinámico basado en la URL
    user,
    roles,
    navConfig,
    MENU_ITEMS,
    handleNavigation,
    loading,
  };
};
