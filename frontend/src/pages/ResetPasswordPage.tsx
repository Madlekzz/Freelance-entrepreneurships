import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "../config/supabaseClient";
import { updatePassword } from "../services/authService";
import freelanceLogo from "../assets/Isotipo FLA-Blanco.png";

export default function ResetPasswordPage() {
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			if (!session) {
				setError("El enlace de invitación ha expirado o es inválido.");
			}
		};
		checkSession();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword)
			return setError("Las contraseñas no coinciden.");
		if (password.length < 6) return setError("Mínimo 6 caracteres.");

		setLoading(true);
		setError(null);

		try {
			await updatePassword(password);
			setSuccess(true);
			setTimeout(() => navigate("/login"), 3000);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error al actualizar.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
			<div className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-xl min-h-150">
				{/* ── Panel Izquierdo (Branding Identico a Login) ── */}
				<div className="hidden md:flex w-[45%] bg-primary flex-col justify-between gap-4 p-10 relative overflow-hidden shrink-0">
					<div className="absolute w-96 h-96 rounded-full border border-white/10 -top-24 -right-28 pointer-events-none" />
					<div className="absolute w-64 h-64 rounded-full border border-white/10 -bottom-20 -left-24 pointer-events-none" />

					<div className="relative">
						<button className="cursor-pointer" onClick={() => navigate("/")}>
							<img
								src={freelanceLogo}
								alt="Logo"
								className="h-10 w-auto object-contain mb-6"
							/>
						</button>
						<h1 className="font-display text-[2.25rem] font-bold text-white leading-tight mb-4">
							Freelance
							<br />
							Latin America
						</h1>
						<p className="text-white/55 text-sm leading-relaxed">
							Activación de cuenta y
							<br />
							configuración de seguridad
						</p>
					</div>

					<div className="relative flex flex-col gap-3">
						<div className="flex items-center gap-2.5 text-white/70 text-sm">
							<div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
								<div className="w-2 h-2 rounded-full bg-white" />
							</div>
							Contraseña encriptada
						</div>
						<p className="text-white/25 text-xs mt-4">
							© 2026 Freelance Latin America
						</p>
					</div>
				</div>

				{/* ── Panel Derecho (Formulario) ── */}
				<div className="flex-1 bg-white flex items-center justify-center px-8 py-12 md:px-12">
					<div className="w-full max-w-sm">
						{/* Mobile Logo */}
						<div className="flex items-center gap-2 mb-8 md:hidden">
							<div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center" />
							<span className="font-display font-semibold text-gray-900">
								Freelance <span className="text-primary">LA</span>
							</span>
						</div>

						{success ? (
							<div className="text-center animate-in zoom-in duration-300">
								<div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6">
									<CheckCircle2 size={32} />
								</div>
								<h2 className="text-2xl font-bold text-gray-900 mb-2">
									¡Todo listo!
								</h2>
								<p className="text-gray-500 mb-6 text-sm">
									Tu contraseña ha sido configurada. Redirigiendo...
								</p>
								<div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
									<div className="bg-green-500 h-full animate-progress-bar"></div>
								</div>
							</div>
						) : (
							<>
								<div className="mb-8">
									<h2 className="text-2xl font-bold text-gray-900">
										Configura tu acceso
									</h2>
									<p className="text-gray-500 text-sm mt-2">
										Ingresa una contraseña segura para tu nueva cuenta.
									</p>
								</div>

								{error && (
									<div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-lg">
										{error}
									</div>
								)}

								<form onSubmit={handleSubmit} className="space-y-4">
									<div className="space-y-1">
										<label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">
											Nueva Contraseña
										</label>
										<div className="relative">
											<Lock
												className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
												size={18}
											/>
											<input
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
												className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
											>
												{showPassword ? (
													<EyeOff size={18} />
												) : (
													<Eye size={18} />
												)}
											</button>
										</div>
									</div>

									<div className="space-y-1">
										<label className="text-xs font-semibold text-gray-500 ml-1 uppercase tracking-wider">
											Confirmar
										</label>
										<div className="relative">
											<Lock
												className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
												size={18}
											/>
											<input
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
										className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
									>
										{loading ? (
											<Loader2 className="animate-spin" size={20} />
										) : (
											"Activar Mi Cuenta"
										)}
									</button>
								</form>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
