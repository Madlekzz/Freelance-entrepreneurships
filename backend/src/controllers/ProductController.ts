import type { Request, Response } from "express";
import { supabaseAdmin } from "../db.js";
import { uploadProductImage } from "../services/uploadImageService.js";
import { checkAndNotifyLowStock } from "../services/slackService.js";

// [PÚBLICO] Obtener todos los productos activos de emprendimientos activos
export async function getActiveProducts(req: Request, res: Response) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*, entrepreneurships(id, name)")
    .eq("is_active", true)
    .eq("entrepreneurships.is_active", true);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

// [ADMIN/IT] Obtener todos los productos
export async function getAllProducts(req: Request, res: Response) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*, entrepreneurships(id, name)");

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

// Obtener todos los productos de un emprendimiento específico
export async function getProductsByEntrepreneurship(
  req: Request,
  res: Response,
) {
  const { entrepreneurship_id } = req.params;
  const requestingUser = req.user;

  // Si es PROVEEDOR, verificamos que el emprendimiento le pertenezca
  if (requestingUser?.user_metadata.roles.includes("PROVEEDOR")) {
    const { data: entrepreneurship } = await supabaseAdmin
      .from("entrepreneurships")
      .select("owner_id")
      .eq("id", entrepreneurship_id)
      .single();

    if (!entrepreneurship) {
      return res.status(404).json({ error: "Emprendimiento no encontrado" });
    }

    if (entrepreneurship.owner_id !== requestingUser.id) {
      return res.status(403).json({
        error:
          "No tienes permiso para ver los productos de este emprendimiento",
      });
    }
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("entrepreneurship_id", entrepreneurship_id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

// Obtener un producto por ID
export async function getProductById(req: Request, res: Response) {
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*, entrepreneurships(id, name)")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Producto no encontrado" });
  res.status(200).json(data);
}

// [PROVEEDOR] Crear un producto
export async function createProduct(req: Request, res: Response) {
  const requestingUser = req.user;
  const imageFile = req.file;

  // 1. Extracción y conversión de tipos (FormData envía strings)
  const { entrepreneurship_id, name, is_active, category_id } = req.body;
  const price = parseFloat(req.body.price);
  const current_stock = parseInt(req.body.current_stock, 10);

  // 2. Validación de campos obligatorios
  if (
    !entrepreneurship_id ||
    !name ||
    Number.isNaN(price) ||
    Number.isNaN(current_stock)
  ) {
    return res.status(400).json({
      error:
        "Los campos entrepreneurship_id, name, price y current_stock son obligatorios y deben ser válidos",
    });
  }

  try {
    // 3. Verificamos que el emprendimiento exista y pertenezca al usuario
    const { data: entrepreneurship, error: entError } = await supabaseAdmin
      .from("entrepreneurships")
      .select("owner_id")
      .eq("id", entrepreneurship_id)
      .single();

    if (entError || !entrepreneurship) {
      return res.status(404).json({ error: "Emprendimiento no encontrado" });
    }

    if (entrepreneurship.owner_id !== requestingUser?.id) {
      return res.status(403).json({
        error: "No tienes permiso para agregar productos a este emprendimiento",
      });
    }

    // 4. Lógica de subida de imagen al Storage
    let imageUrl: string | null = null;
    if (imageFile) {
      // Normalizamos el nombre del archivo para evitar caracteres extraños en la URL
      const cleanName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const fileName = `${Date.now()}-${cleanName}`;
      const path = `${entrepreneurship_id}/${fileName}`;

      imageUrl = await uploadProductImage(imageFile, path);
    }

    // 5. Inserción en la base de datos
    const { data: newProduct, error: insertError } = await supabaseAdmin
      .from("products")
      .insert({
        entrepreneurship_id,
        name,
        price,
        current_stock,
        image: imageUrl, // Usamos la URL generada por el Storage
        is_active: is_active === "true" || is_active === true, // Manejo de booleano desde FormData
        category_id: category_id ? parseInt(category_id, 10) : null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // 6. Respuesta exitosa
    return res.status(201).json(newProduct);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error desconocido al crear producto";
    console.error("[createProduct Error]:", message);

    return res.status(400).json({ error: message });
  }
}

// Actualizar un producto
export async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  const requestingUser = req.user;
  const imageFile = req.file;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "ID de producto inválido" });
  }

  try {
    // 1. Verificar existencia del producto y permisos de dueño
    const { data: product, error: fetchError } = await supabaseAdmin
      .from("products")
      .select("*, entrepreneurships(owner_id)")
      .eq("id", id)
      .single();

    if (fetchError || !product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // El PROVEEDOR solo puede editar sus propios productos
    if (requestingUser?.user_metadata.roles.includes("PROVEEDOR")) {
      if (product.entrepreneurships.owner_id !== requestingUser.id) {
        return res
          .status(403)
          .json({ error: "No tienes permiso para editar este producto" });
      }
    }

    // 2. Preparar el objeto de actualización
    type UpdatesType = {
      name?: string;
      price?: string | number;
      current_stock?: string | number;
      is_active?: string | boolean;
      category_id?: string | number;
      image?: string;
      entrepreneurships?: unknown;
      entrepreneurship_id?: unknown;
    };
    const updates: UpdatesType = { ...req.body };

    if (updates.price) updates.price = parseFloat(updates.price as string);
    if (updates.current_stock)
      updates.current_stock = parseInt(updates.current_stock as string, 10);
    if (updates.is_active !== undefined) {
      updates.is_active =
        updates.is_active === "true" || updates.is_active === true;
    }
    if (updates.category_id) {
      updates.category_id = parseInt(updates.category_id as string, 10);
    }

    // 3. Manejo de la nueva imagen (si se subió una)
    if (imageFile) {
      // Usamos el ID del producto para el nombre del archivo para mantener consistencia
      const fileName = `${Date.now()}-${id}`;
      const path = `${product.entrepreneurship_id}/${fileName}`;

      // Subimos y obtenemos la nueva URL
      updates.image = await uploadProductImage(imageFile, path);
    }

    // 4. Limpieza de datos antes de enviar a Supabase
    // Eliminamos campos que no existen en la tabla 'products' (como los datos unidos del owner)
    delete updates.entrepreneurships;
    delete updates.entrepreneurship_id; // Normalmente no permitimos cambiar el producto de dueño/tienda

    // 5. Ejecutar la actualización
    const { data: updatedProduct, error: updateError } = await supabaseAdmin
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    if (updates.current_stock !== undefined) {
      try {
        const stockValue = updates.current_stock;
        let newStock: number;
        if (typeof stockValue === "number") {
          newStock = stockValue;
        } else if (typeof stockValue === "string") {
          newStock = parseInt(stockValue, 10);
        } else {
          newStock = 0;
        }
        if (!Number.isNaN(newStock)) {
          await checkAndNotifyLowStock([
            { product_id: id, new_stock: newStock },
          ]);
        }
      } catch (stockErr) {
        console.error("Error checking low stock:", stockErr);
      }
    }

    return res.status(200).json({
      message: "Producto actualizado correctamente",
      data: updatedProduct,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error al actualizar producto";
    console.error("[updateProduct Error]:", message);
    return res.status(400).json({ error: message });
  }
}

// Eliminar un producto
export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID de producto inválido o ausente" });
  }

  try {
    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
}
