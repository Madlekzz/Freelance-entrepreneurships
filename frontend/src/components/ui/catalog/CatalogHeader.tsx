import { useNavigate } from "react-router-dom";
// Añadimos el icono User o LayoutDashboard para el estado loggeado
import { LogIn, ShoppingCart, User } from "lucide-react";
import FreelanceLogo from "../../../assets/Isologo Freelance Latin America.png";
import { useEffect, useState } from "react";
import { supabase } from "../../../config/supabaseClient";

interface Props {
	cartCount: number;
	onCartClick: () => void;
}

export default function CatalogHeader({ cartCount, onCartClick }: Props) {
	const navigate = useNavigate();
	const [isLoggedIn, setIsLoggedIn] = useState(false);

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

	const handleAuthAction = () => {
		if (isLoggedIn) {
			navigate("/dashboard");
		} else {
			navigate("/login");
		}
	};

	return (
		<header className="bg-white border-b border-gray-100 px-8 h-20 flex items-center justify-between sticky top-0 z-10">
			<div className="flex items-center">
				<img
					src={FreelanceLogo}
					alt="Logo de Freelance Latin America"
					className="h-16 w-auto object-contain"
				/>
			</div>

			<div className="flex items-center gap-4">
				{/* Botón de Autenticación Dinámico */}
				<button
					onClick={handleAuthAction}
					title={isLoggedIn ? "Ir al Dashboard" : "Iniciar Sesión"}
					className="flex items-center gap-2 p-3 cursor-pointer border border-gray-200 rounded-full text-sm text-gray-600 hover:border-primary hover:text-primary transition-all hover:bg-gray-50 active:scale-95"
				>
					{isLoggedIn ? (
						// Icono cuando hay sesión (puedes usar LayoutDashboard si prefieres)
						<User size={20} />
					) : (
						// Icono por defecto
						<LogIn size={20} />
					)}
				</button>

				<button
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
	);
}
