import type { Request, Response, NextFunction } from "express";
import { supabase } from "../db.ts";
import type { User } from "@supabase/supabase-js";

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}

export async function authenticate(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	// 1. Obtener el token del header 'Authorization'
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "No autorizado, falta el token" });
	}

	const token = authHeader.split(" ")[1];

	try {
		// 2. Validar el token con Supabase
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser(token);

		if (error || !user) {
			return res.status(401).json({ error: "Token inválido o expirado" });
		}

		// 3. Inyectar el usuario en la petición para usarlo luego
		req.user = user;
		next();
	} catch (error) {
		return res.status(500).json({ error: "Error en la autenticación" });
	}
}
