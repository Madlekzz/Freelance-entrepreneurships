import type { Request, Response } from "express";
import { supabaseAdmin } from "../db.js";

export async function createSystemUser(req: Request, res: Response) {
  const { email, name, roles, departamento } = req.body;

  // 1. Crear el usuario en la Autenticación de Supabase
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password: "PasswordTemporal123!", // O generar una aleatoria
      email_confirm: true,
      user_metadata: { name, roles, departamento }, // Metadatos útiles
    });

  if (authError) return res.status(400).json({ error: authError.message });

  res
    .status(201)
    .json({ message: "Usuario creado con éxito", user: authData.user });
}

// Obtener todos los usuarios
export async function getAllUsers(_req: Request, res: Response) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .order("name", { ascending: true });
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

export async function getPublicConsumers(_req: Request, res: Response) {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, email, name, departamento")
      .contains("roles", ["CONSUMIDOR"])
      .order("name", { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Error al obtener sesiones activas:", error);
    return res.status(500).json({
      error: "No se pudo obtener los consumidores",
    });
  }
}

// Obtener un usuario por ID
export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*, entrepreneurships(*)") // Incluimos su emprendimiento si existe
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Usuario no encontrado" });
  res.status(200).json(data);
}

// Ejemplo en el Controller del Backend
export const getActiveSessionsCount = async (_req: Request, res: Response) => {
  try {
    // Llamamos a la función RPC que creamos en el SQL Editor
    // Pasamos 24 como el parámetro 'hours_threshold'
    const { data, error } = await supabaseAdmin.rpc(
      "get_active_session_count",
      { hours_threshold: 24 },
    );

    if (error) {
      console.error("Error RPC Supabase:", error.message);
      throw error;
    }

    // data contiene directamente el número retornado por la función
    return res.json({ count: data || 0 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    console.error("Controlador IT Error:", errorMessage);

    return res.status(500).json({
      error: "No se pudo obtener la métrica de sesiones activas",
      details: errorMessage,
    });
  }
};

// Modificar un usuario
export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  const updates = req.body;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID de usuario inválido o ausente" });
  }

  // Verificamos que el usuario existe antes de actualizar
  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("id", id)
    .single();

  if (!existing) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const { data, error } = await supabaseAdmin
    .from("users")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });

  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
    id,
    {
      user_metadata: updates,
    },
  );

  if (authError) {
    return res.status(500).json({
      error:
        "Usuario actualizado en la base de datos pero falló la sincronización con Auth",
      detail: authError.message,
    });
  }

  res.status(200).json({ message: "Usuario actualizado correctamente", data });
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
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al obtener sesiones activas:", error);
    return res.status(500).json({
      error: "No se pudo eliminar el usuario del sistema.",
    });
  }
}
