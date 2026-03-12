import type { Request, Response } from "express";
import { supabase } from "../db.ts";

// Obtener todos los usuarios
export async function getAllUsers(req: Request, res: Response) {
	const { data, error } = await supabase.from("users").select("*");
	if (error) return res.status(400).json({ error: error.message });
	res.status(200).json(data);
}

// Obtener un usuario por ID
export async function getUserById(req: Request, res: Response) {
	const { id } = req.params;
	const { data, error } = await supabase
		.from("users")
		.select("*, entrepreneurships(*)") // Incluimos su emprendimiento si existe
		.eq("id", id)
		.single();

	if (error) return res.status(404).json({ error: "Usuario no encontrado" });
	res.status(200).json(data);
}

// Modificar un usuario
export async function updateUser(req: Request, res: Response) {
	const { id } = req.params;
	const updates = req.body;

	const { data, error } = await supabase
		.from("users")
		.update(updates)
		.eq("id", id);

	if (error) return res.status(400).json({ error: error.message });
	res.status(200).json({ message: "Usuario actualizado correctamente" });
}

// Borrar un usuario
export async function deleteUser(req: Request, res: Response) {
	const { id } = req.params;

	// Si id es undefined o un array, esto nos protege
	if (!id || typeof id !== "string") {
		return res.status(400).json({ error: "ID de usuario inválido o ausente" });
	}

	try {
		// Ahora TypeScript sabe que id es un string porque validamos antes
		const { error } = await supabase.auth.admin.deleteUser(id);

		if (error) {
			return res.status(400).json({ error: error.message });
		}

		res.status(200).json({ message: "Usuario eliminado correctamente" });
	} catch (error) {
		res.status(500).json({ error: "Error interno" });
	}
}
