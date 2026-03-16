import type { Request, Response } from "express";
import { supabase } from "../db.ts";

// [PÚBLICO] Obtener todos los emprendimientos activos (para el catálogo)
export async function getActiveEntrepreneurships(req: Request, res: Response) {
  const { data, error } = await supabase
    .from("entrepreneurships")
    .select("*, users(id, name, email)")
    .eq("is_active", true);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

// [ADMIN/IT] Obtener todos los emprendimientos
export async function getAllEntrepreneurships(req: Request, res: Response) {
  const { data, error } = await supabase
    .from("entrepreneurships")
    .select("*, users(id, name, email)");

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

// Obtener un emprendimiento por ID
export async function getEntrepreneurshipById(req: Request, res: Response) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("entrepreneurships")
    .select("*, users(id, name, email)")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Emprendimiento no encontrado" });
  res.status(200).json(data);
}

// [PROVEEDOR] Crear un emprendimiento — el owner_id se toma del token
export async function createEntrepreneurship(req: Request, res: Response) {
  const { name } = req.body;
  const owner_id = req.user?.id; // Viene del middleware de autenticación

  if (!name) {
    return res.status(400).json({ error: "El campo 'name' es obligatorio" });
  }

  const { data, error } = await supabase
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
  const updates = req.body;
  const requestingUser = req.user;

  // Siempre verificamos que el emprendimiento exista
  const { data: entrepreneurship } = await supabase
    .from("entrepreneurships")
    .select("owner_id")
    .eq("id", id)
    .single();

  if (!entrepreneurship) {
    return res.status(404).json({ error: "Emprendimiento no encontrado" });
  }

  // El Proveedor solo puede editar los suyos — Admin e IT pueden editar cualquiera
  if (requestingUser?.user_metadata.role.includes("PROVEEDOR") && entrepreneurship.owner_id !== requestingUser.id) {
    return res.status(403).json({ error: "No tienes permiso para editar este emprendimiento" });
  }


  const { data, error } = await supabase
    .from("entrepreneurships")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: "Emprendimiento actualizado correctamente", data });
}

// [IT] Eliminar un emprendimiento
export async function deleteEntrepreneurship(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID de emprendimiento inválido o ausente" });
  }

  try {
    const { error } = await supabase
      .from("entrepreneurships")
      .delete()
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Emprendimiento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
}