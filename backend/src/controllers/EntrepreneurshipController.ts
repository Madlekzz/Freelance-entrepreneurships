import type { Request, Response } from "express";
import { supabaseAdmin } from "../db.js";

// [PÚBLICO] Obtener todos los emprendimientos activos (para el catálogo)
export async function getActiveEntrepreneurships(_req: Request, res: Response) {
  const { data, error } = await supabaseAdmin
    .from("entrepreneurships")
    .select("*, users(id, name, email)")
    .eq("is_active", true);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

// [ADMIN/IT] Obtener todos los emprendimientos
export async function getAllEntrepreneurships(_req: Request, res: Response) {
  const { data, error } = await supabaseAdmin
    .from("entrepreneurships")
    .select("*, users(id, name, email)");

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

// Obtener un emprendimiento por ID
export async function getEntrepreneurshipById(req: Request, res: Response) {
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from("entrepreneurships")
    .select("*, users(id, name, email)")
    .eq("id", id)
    .single();

  if (error)
    return res.status(404).json({ error: "Emprendimiento no encontrado" });
  res.status(200).json(data);
}

// [PROVEEDOR] Obtener solo los emprendimientos del usuario autenticado
export async function getMyEntrepreneurships(req: Request, res: Response) {
  const owner_id = req.user?.id; // Extraído del token por tu middleware

  if (!owner_id) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  try {
    // Traemos los emprendimientos y contamos sus productos de forma relacional
    const { data, error } = await supabaseAdmin
      .from("entrepreneurships")
      .select(
        `
        *,
        products(count)
      `,
      )
      .eq("owner_id", owner_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Formateamos la respuesta para que el count sea más fácil de leer en el front
    const formattedData = data.map((item) => ({
      ...item,
      product_count: item.products?.[0]?.count || 0,
    }));

    res.status(200).json(formattedData);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error al consultar los emprendimientos del usuario";
    console.error("Error al obtener emprendimientos:", message);
    res.status(500).json({ error: `Error al cargar tus emprendimientos: ${message}` });
  }
}

// [PROVEEDOR] Crear un emprendimiento — el owner_id se toma del token
export async function createEntrepreneurship(req: Request, res: Response) {
  const { name } = req.body;
  const owner_id = req.user?.id; // Viene del middleware de autenticación

  if (!name) {
    return res.status(400).json({ error: "El campo 'name' es obligatorio" });
  }

  const { data, error } = await supabaseAdmin
    .from("entrepreneurships")
    .insert({ name, owner_id, is_active: true })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
}

// Actualizar un emprendimiento
export async function updateEntrepreneurship(req: Request, res: Response) {
  const { id } = req.params;
  const requestingUser = req.user;

  // Siempre verificamos que el emprendimiento exista
  const { data: entrepreneurship } = await supabaseAdmin
    .from("entrepreneurships")
    .select("owner_id")
    .eq("id", id)
    .single();

  if (!entrepreneurship) {
    return res.status(404).json({ error: "Emprendimiento no encontrado" });
  }

  // El Proveedor solo puede editar los suyos — Admin e IT pueden editar cualquiera
  if (
    requestingUser?.user_metadata.roles.includes("PROVEEDOR") &&
    entrepreneurship.owner_id !== requestingUser.id
  ) {
    return res
      .status(403)
      .json({ error: "No tienes permiso para editar este emprendimiento" });
  }

  // Whitelist de campos permitidos para actualización
  const allowedFields = ["name", "description"];
  const updates: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No hay campos válidos para actualizar" });
  }

  const { data, error } = await supabaseAdmin
    .from("entrepreneurships")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res
    .status(200)
    .json({ message: "Emprendimiento actualizado correctamente", data });
}

// [IT] Eliminar un emprendimiento
export async function deleteEntrepreneurship(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return res
      .status(400)
      .json({ error: "ID de emprendimiento inválido o ausente" });
  }

  try {
    const { error } = await supabaseAdmin
      .from("entrepreneurships")
      .delete()
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Emprendimiento eliminado correctamente" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error al eliminar el emprendimiento de la base de datos";
    console.error("Error al eliminar emprendimiento:", errorMessage);
    res.status(500).json({ error: `No se pudo eliminar el emprendimiento: ${errorMessage}` });
  }
}
