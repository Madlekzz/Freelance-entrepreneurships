import { useState } from "react";
import type { RegisterForm, UserRole } from "../../../types";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Select } from "antd";
import { requestAccess } from "../../../services/authService";

// Definimos las opciones fuera para evitar re-renderizados innecesarios
const ROLE_OPTIONS = [
	{ label: "IT", value: "IT" },
	{ label: "Administrador", value: "ADMIN" },
	{ label: "Proveedor", value: "PROVEEDOR" },
	{ label: "Consumidor", value: "CONSUMIDOR" },
];

export default function RegisterForm() {
	const [form, setForm] = useState<RegisterForm>({
		user_name: "",
		email: "",
		entrepreneurship_name: "",
		role: [],
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleChange =
		(key: keyof RegisterForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setError(null);
			setForm((f) => ({ ...f, [key]: e.target.value }));
		};

	const handleRoleChange = (values: UserRole[]) => {
		setError(null);
		setForm((f) => ({ ...f, role: values }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (form.role.length === 0) {
			setError("Debes seleccionar al menos un rol.");
			return;
		}

		setError(null);
		setLoading(true);

		try {
			// Llamamos al servicio corregido
			const response = await requestAccess(form);

			// Si llegamos aquí, el backend respondió con 200/201
			console.log(response.message);
			setSuccess(true);
		} catch (err: unknown) {
			setError(
				err instanceof Error ? err.message : "Error al enviar la solicitud",
			);
		} finally {
			setLoading(false);
		}
	};

	const inputClass =
		"w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-primary transition-colors placeholder:text-gray-300";

	if (success) {
		return (
			<div className="flex flex-col items-center text-center py-6 gap-4">
				<div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
					<CheckCircle2 size={32} className="text-primary" />
				</div>
				<div>
					<h3 className="font-display text-xl font-bold text-gray-900 mb-2">
						¡Solicitud enviada!
					</h3>
					<p className="text-sm text-gray-400 leading-relaxed">
						Tu solicitud fue recibida. El equipo de IT la revisará y activará tu
						cuenta en breve.
					</p>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
			<div>
				<h2 className="font-display text-2xl font-bold text-gray-900 mb-1">
					Solicitar acceso
				</h2>
				<p className="text-sm text-gray-400">
					IT revisará tu solicitud antes de activar la cuenta
				</p>
			</div>

			<div className="flex flex-col gap-3.5">
				<div>
					<label className="block text-sm font-medium text-gray-600 mb-1.5">
						Nombre completo
					</label>
					<input
						type="text"
						placeholder="Tu nombre completo"
						value={form.user_name}
						onChange={handleChange("user_name")}
						required
						className={inputClass}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-600 mb-1.5">
						Correo electrónico
					</label>
					<input
						type="email"
						placeholder="tu@email.com"
						value={form.email}
						onChange={handleChange("email")}
						required
						className={inputClass}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-600 mb-1.5">
						Nombre del Emprendimiento (opcional)
					</label>
					<input
						type="text"
						placeholder="El nombre de tu emprendimiento"
						value={form.entrepreneurship_name}
						onChange={handleChange("entrepreneurship_name")}
						className={inputClass}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-600 mb-1.5">
						Roles solicitados
					</label>
					<Select
						mode="multiple"
						allowClear
						placeholder="Selecciona tus roles"
						value={form.role}
						onChange={handleRoleChange}
						options={ROLE_OPTIONS}
						maxTagCount="responsive"
						className={inputClass}
					/>
					<p className="text-[10px] text-gray-400 mt-1 italic">
						* Puedes seleccionar más de un rol si es necesario.
					</p>
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
				{loading && <Loader2 size={16} className="animate-spin" />}
				Enviar solicitud
			</button>
		</form>
	);
}
