import type { Request, Response } from "express";
import { supabase } from "../db.ts";

export async function SignupRequest(req: Request, res: Response) {
	try {
		const { email, user_name, entrepreneurship_name, role } = req.body;

		if (!email || !user_name || !role)
			return res
				.status(400)
				.json({ error: "Los campos de email, nombre y rol son obligatorios" });

		const rolesArray = Array.isArray(role) ? role : [role];

		const { data, error } = await supabase
			.from("signup_request")
			.insert([{ email, user_name, entrepreneurship_name, role: rolesArray }]);

		if (error) return res.status(400).json({ error: error.message });
		res.status(201).json({ message: "Successful signup request " });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
}

export async function ApproveSignup(req: Request, res: Response) {
	const { requestId } = req.params; // El ID de la tabla signup_request

	console.log(requestId)
	try {
		// 1. Obtener los datos de la solicitud
		const { data: request, error: fetchError } = await supabase
			.from("signup_request")
			.select("*")
			.eq("id", requestId)
			.single();
		if (fetchError || !request) {
			return res.status(404).json({ error: fetchError });
		}

		// 2. Crear el usuario en Supabase Auth
		const rolesArray = Array.isArray(request.role)
			? request.role
			: [request.role];
		const { data: authUser, error: authError } =
			await supabase.auth.admin.inviteUserByEmail(request.email, {
				redirectTo: 'http://localhost:5173/reset-password',
				data: {
					name: request.user_name,
					entrepreneurship_name: request.entrepreneurship_name,
					role: rolesArray,
				},
			});

		if (authError) return res.status(400).json({ error: authError.message });

		// 3. Marcar la solicitud como aprobada
		await supabase
			.from("signup_request")
			.update({ status: "APROBADO" }) // Asegúrate de tener este ENUM o columna
			.eq("id", requestId);

		res.status(200).json({
			message: "Proveedor aprobado y correo de invitación enviado",
			user: authUser.user,
		});
	} catch (error) {
		res.status(500).json({ error: "Error interno del servidor" });
	}
}

export async function Login(req: Request, res: Response) {
	const { email, password } = req.body;

	try {
		// 1. Validar que vengan los datos
		if (!email || !password) {
			return res
				.status(400)
				.json({ error: "Email y contraseña son requeridos" });
		}

		// 2. Intentar inicio de sesión en Supabase Auth
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			// Error común: "Invalid login credentials"
			return res.status(401).json({ error: error.message });
		}

		// 3. Si es exitoso, devolvemos la sesión y el usuario
		// El 'session' contiene el access_token que usará el frontend
		return res.status(200).json({
			message: "Login exitoso",
			session: data.session,
			user: data.user,
		});
	} catch (error) {
		console.error("Login error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
}
