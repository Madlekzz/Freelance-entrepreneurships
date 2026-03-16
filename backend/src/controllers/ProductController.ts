import type { Request, Response } from "express";
import { supabase } from "../db.ts";

// [PÚBLICO] Obtener todos los productos activos de emprendimientos activos
export async function getActiveProducts(req: Request, res: Response) {
  const { data, error } = await supabase
    .from("products")
    .select("*, entrepreneurships(id, name)")
    .eq("is_active", true)
    .eq("entrepreneurships.is_active", true);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

// [ADMIN/IT] Obtener todos los productos
export async function getAllProducts(req: Request, res: Response) {
  const { data, error } = await supabase
    .from("products")
    .select("*, entrepreneurships(id, name)");

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

// Obtener todos los productos de un emprendimiento específico
export async function getProductsByEntrepreneurship(req: Request, res: Response) {
  const { entrepreneurship_id } = req.params;
  const requestingUser = req.user;

  // Si es PROVEEDOR, verificamos que el emprendimiento le pertenezca
  if (requestingUser?.user_metadata.role.includes("PROVEEDOR")) {
    const { data: entrepreneurship } = await supabase
      .from("entrepreneurships")
      .select("owner_id")
      .eq("id", entrepreneurship_id)
      .single();

    if (!entrepreneurship) {
      return res.status(404).json({ error: "Emprendimiento no encontrado" });
    }

    if (entrepreneurship.owner_id !== requestingUser.id) {
      return res.status(403).json({ error: "No tienes permiso para ver los productos de este emprendimiento" });
    }
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("entrepreneurship_id", entrepreneurship_id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

// Obtener un producto por ID
export async function getProductById(req: Request, res: Response) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("products")
    .select("*, entrepreneurships(id, name)")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Producto no encontrado" });
  res.status(200).json(data);
}

// [PROVEEDOR] Crear un producto
export async function createProduct(req: Request, res: Response) {
  const { entrepreneurship_id, name, price, current_stock, image, is_active } = req.body;
  const requestingUser = req.user;

  if (!entrepreneurship_id || !name || price === undefined || current_stock === undefined) {
    return res.status(400).json({ error: "Los campos entrepreneurship_id, name, price y current_stock son obligatorios" });
  }

  // Verificamos que el emprendimiento exista y le pertenezca al proveedor
  const { data: entrepreneurship } = await supabase
    .from("entrepreneurships")
    .select("owner_id")
    .eq("id", entrepreneurship_id)
    .single();

  if (!entrepreneurship) {
    return res.status(404).json({ error: "Emprendimiento no encontrado" });
  }

  if (entrepreneurship.owner_id !== requestingUser?.id) {
    return res.status(403).json({ error: "No tienes permiso para agregar productos a este emprendimiento" });
  }

  const { data, error } = await supabase
    .from("products")
    .insert({ entrepreneurship_id, name, price, current_stock, image: image ?? null, is_active })
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
}

// Actualizar un producto
export async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  const updates = req.body;
  const requestingUser = req.user;

  // Siempre verificamos que el producto exista
  const { data: product } = await supabase
    .from("products")
    .select("*, entrepreneurships(owner_id)")
    .eq("id", id)
    .single();

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  // El PROVEEDOR solo puede editar productos de sus propios emprendimientos
  if (requestingUser?.user_metadata.role.includes("PROVEEDOR")) {
    if (product.entrepreneurships.owner_id !== requestingUser.id) {
      return res.status(403).json({ error: "No tienes permiso para editar este producto" });
    }

  }

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: "Producto actualizado correctamente", data });
}

// [IT] Eliminar un producto
export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID de producto inválido o ausente" });
  }

  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
}