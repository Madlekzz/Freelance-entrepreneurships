import { Bell, LogIn, ShoppingCart, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FreelanceLogo from "../../../assets/Isologo Freelance Latin America.png";
import FreelanceIsotipo from "../../../assets/Isotipo FLA-Blanco.png";
import { supabase } from "../../../config/supabaseClient";
import { useSoftwareUpdates } from "../../../hooks/useSoftwareUpdates";
import SoftwareUpdatesWidget from "../../layout/SoftwareUpdatesWidget";

interface Props {
  cartCount: number;
  onCartClick: () => void;
  isCartOpen: boolean;
  closeCart: () => void;
}

export default function CatalogHeader({
  cartCount,
  onCartClick,
  isCartOpen,
  closeCart,
}: Props) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { updates, loading, unreadCount, markAsRead } = useSoftwareUpdates();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Click outside to close popover
  useEffect(() => {
    if (!popoverOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [popoverOpen]);

  // Mark updates as read when opening the dropdown
  useEffect(() => {
    if (popoverOpen) {
      markAsRead();
    }
  }, [popoverOpen, markAsRead]);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-100 px-8 h-20  items-center justify-between sticky top-0 z-10 hidden md:flex">
        <div className="flex items-center">
          <img
            src={FreelanceLogo}
            alt="Logo de Freelance Latin America"
            className="h-12 w-auto object-contain md:h-16"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Botón de Autenticación Dinámico */}
          <button
            type="button"
            onClick={handleAuthAction}
            title={isLoggedIn ? "Ir al Dashboard" : "Iniciar Sesión"}
            className="flex items-center gap-2 p-3 cursor-pointer border border-gray-200 rounded-full text-sm text-gray-600 hover:border-primary hover:text-primary transition-all hover:bg-gray-50 active:scale-95"
          >
            {isLoggedIn ? (
              <User size={20} />
            ) : (
              <LogIn size={20} />
            )}
          </button>

          {/* Software Updates Bell */}
          <div className="relative" ref={popoverRef}>
            <button
              type="button"
              onClick={() => setPopoverOpen((prev) => !prev)}
              className="relative flex items-center gap-2 p-3 cursor-pointer text-gray-600 border-gray-200 hover:text-primary hover:border-primary border rounded-full text-sm font-medium transition-all hover:bg-gray-50 active:scale-95"
              title="Novedades"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold min-w-5 h-5 px-1 flex items-center justify-center rounded-full border-2 border-white shadow-sm z-10 animate-in zoom-in duration-200">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {popoverOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
                <div className="p-3">
                  <SoftwareUpdatesWidget
                    updates={updates}
                    loading={loading}
                    unreadCount={unreadCount}
                    onMarkAsRead={markAsRead}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onCartClick}
            className="relative flex items-center gap-2 p-3 cursor-pointer text-gray-600 border-gray-200 hover:text-primary hover:border-primary border rounded-full text-sm font-medium transition-all hover:bg-gray-50 active:scale-95"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold min-w-5 h-5 px-1 flex items-center justify-center rounded-full border-2 border-white shadow-sm z-10 animate-in zoom-in duration-200">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* --- NAVEGACIÓN MÓVIL --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-4 py-3 z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-around">
          {/* Botón Tienda (Isotipo) */}
          <button
            type="button"
            onClick={closeCart} // Al hacer clic en Tienda, forzamos el cierre del carrito
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <div
              style={{
                maskImage: `url(${FreelanceIsotipo})`,
                WebkitMaskImage: `url(${FreelanceIsotipo})`,
                maskRepeat: "no-repeat",
                maskPosition: "center",
                maskSize: "contain",
              }}
              // CAMBIO LÓGICO: Si el carrito NO está abierto, es color primary (Catálogo activo)
              className={`h-6 w-6 transition-colors duration-200 ${
                !isCartOpen ? "bg-primary" : "bg-gray-400"
              }`}
            />
            <span
              className={`text-[10px] font-medium transition-colors duration-200 ${
                !isCartOpen ? "text-primary" : "text-gray-400"
              }`}
            >
              Tienda
            </span>
          </button>

          {/* Botón Carrito */}
          <button
            type="button"
            onClick={onCartClick}
            // CAMBIO LÓGICO: Si el carrito SÍ está abierto, resaltamos en primary
            className={`relative flex flex-col items-center gap-1 transition-colors duration-200 cursor-pointer ${
              isCartOpen ? "text-primary" : "text-gray-400"
            }`}
          >
            <div className="relative">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border border-white">
                  {cartCount > 99 ? "+" : cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold">Carrito</span>
          </button>

          {/* Botón Auth (Se mantiene igual, gris para no competir visualmente) */}
          <button
            type="button"
            onClick={handleAuthAction}
            className="flex flex-col items-center gap-1 text-gray-400 cursor-pointer"
          >
            {isLoggedIn ? <User size={22} /> : <LogIn size={22} />}
            <span className="text-[10px] font-medium">
              {isLoggedIn ? "Cuenta" : "Ingresar"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
