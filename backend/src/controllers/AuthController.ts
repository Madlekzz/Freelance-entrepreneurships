import type { Request, Response } from "express";
import { supabaseAdmin } from "../db.js";
import { signupRequestTemplate } from "../schemas/slackTemplates.js";
import { sendSlackWebhookNotification } from "../services/slackService.js";

export async function SignupRequest(req: Request, res: Response) {
	try {
		const { email, user_name, entrepreneurship_name, role } = req.body;

		if (!email || !user_name || !role)
			return res
				.status(400)
				.json({ error: "Los campos de email, nombre y rol son obligatorios" });

		const rolesArray = Array.isArray(role) ? role : [role];

		const { data: existingRequests, error: existingError } =
			await supabaseAdmin
				.from("signup_request")
				.select("id, status, created_at")
				.eq("email", email.toLowerCase().trim())
				.in("status", ["PENDIENTE", "APROBADO"])
				.order("created_at", { ascending: false });

		if (existingError)
			return res.status(400).json({ error: existingError.message });

		if (existingRequests && existingRequests.length > 0) {
			const lastRequest = existingRequests[0];
			if (lastRequest?.status === "APROBADO") {
				return res.status(400).json({
					error: "Ya existe una cuenta asociada a este correo",
				});
			}

			const requestAge = Date.now() - new Date(lastRequest?.created_at).getTime();
			const oneDayMs = 24 * 60 * 60 * 1000;
			if (requestAge < oneDayMs) {
				const hoursRemaining = Math.ceil((oneDayMs - requestAge) / (60 * 60 * 1000));
				return res.status(429).json({
					error: `Ya tienes una solicitud pendiente. Espera ${hoursRemaining} hora(s) antes de enviar otra.`,
				});
			}
		}

		const { data, error } = await supabaseAdmin
			.from("signup_request")
			.insert([{ email: email.toLowerCase().trim(), user_name, entrepreneurship_name, role: rolesArray }]);

		if (error) return res.status(400).json({ error: error.message });

		const webhookUrl = process.env.SLACK_WEBHOOK_URL_IT;
		if (webhookUrl) {
			const template = signupRequestTemplate(
				user_name,
				email,
				entrepreneurship_name || "",
				rolesArray,
			);
			await sendSlackWebhookNotification(webhookUrl, template);
		}

		res.status(201).json({ message: "Successful signup request " });
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Error al procesar la solicitud de registro";
		console.error("Error en SignupRequest:", errorMessage);
		res.status(500).json({ error: `Error al crear la solicitud de acceso: ${errorMessage}` });
	}
}

export async function GetPendingRequests(_req: Request, res: Response) {
	try {
		// Consultamos la tabla filtrando por el estado que consideres "pendiente"
		// Si no tienes una columna de status, puedes quitar el .eq()
		const { data, error } = await supabaseAdmin
			.from("signup_request")
			.select("*")
			.eq("status", "PENDIENTE") // Ajusta el string según tu base de datos
			.order("created_at", { ascending: false });

		if (error) {
			return res.status(400).json({ error: error.message });
		}

		return res.status(200).json(data);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Error al consultar las solicitudes pendientes";
		console.error("Error fetching pending requests:", errorMessage);
		return res.status(500).json({ error: `Error al obtener las solicitudes de registro: ${errorMessage}` });
	}
}

export async function ApproveSignup(req: Request, res: Response) {
	const { requestId } = req.params; // El ID de la tabla signup_request

	try {
		// 1. Obtener los datos de la solicitud
		const { data: request, error: fetchError } = await supabaseAdmin
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
			await supabaseAdmin.auth.admin.inviteUserByEmail(request.email, {
				redirectTo: "https://app.freelancelatam.net/reset-password",
				data: {
					name: request.user_name,
					entrepreneurship_name: request.entrepreneurship_name,
					roles: rolesArray,
				},
			});

		if (authError) return res.status(400).json({ error: authError.message });

		// 3. Marcar la solicitud como aprobada
		await supabaseAdmin
			.from("signup_request")
			.update({ status: "APROBADO" }) // Asegúrate de tener este ENUM o columna
			.eq("id", requestId);

		res.status(200).json({
			message: "Proveedor aprobado y correo de invitación enviado",
			user: authUser.user,
		});
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Error al aprobar la solicitud e invitar al usuario";
		console.error("Error en ApproveSignup:", errorMessage);
		res.status(500).json({ error: `Error al aprobar la solicitud de acceso: ${errorMessage}` });
	}
}

export async function RejectSignup(req: Request, res: Response) {
	const { requestId } = req.params;

	try {
		// Actualizamos el estado a RECHAZADO (o el valor exacto de tu ENUM)
		const { data, error } = await supabaseAdmin
			.from("signup_request")
			.update({ status: "RECHAZADO" }) // Asegúrate de que coincida con tu tipo ENUM
			.eq("id", requestId)
			.select()
			.single();

		if (error) {
			return res.status(400).json({ error: error.message });
		}

		if (!data) {
			return res.status(404).json({ error: "Solicitud no encontrada" });
		}

		res.status(200).json({ message: "Solicitud rechazada correctamente" });
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "Error al actualizar el estado de la solicitud";
		console.error("Error en RejectSignup:", errorMessage);
		res.status(500).json({ error: `Error al rechazar la solicitud: ${errorMessage}` });
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
		const { data, error } = await supabaseAdmin.auth.signInWithPassword({
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
		const errorMessage = error instanceof Error ? error.message : "Error al verificar las credenciales";
		console.error("Login error:", errorMessage);
		return res.status(500).json({ error: `Error al iniciar sesión: ${errorMessage}` });
	}
}
