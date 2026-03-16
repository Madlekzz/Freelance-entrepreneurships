import type { Request, Response } from "express";
import { supabase } from "../db.ts";

// [ADMIN] Obtener todas las ventas
export async function getAllSales(req: Request, res: Response) {
  const { data, error } = await supabase
    .from("sales")
    .select(`
      *,
      consumers(cedula, nombre, departamento),
      products(id, name, entrepreneurship_id, entrepreneurships(id, name))
    `);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

// [ADMIN/PROVEEDOR] Obtener ventas por emprendimiento
export async function getSalesByEntrepreneurship(req: Request, res: Response) {
  const { entrepreneurship_id } = req.params;
  const requestingUser = req.user;


  // Si es PROVEEDOR verificamos que el emprendimiento le pertenezca
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
      return res.status(403).json({ error: "No tienes permiso para ver las ventas de este emprendimiento" });
    }
  }

  const { data, error } = await supabase
    .from("sales")
    .select(`
      *,
      consumers(cedula, nombre, departamento),
      products(id, name, entrepreneurship_id)
    `)
    .eq("products.entrepreneurship_id", entrepreneurship_id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

// [ADMIN] Obtener ventas por consumidor
export async function getSalesByConsumer(req: Request, res: Response) {
  const { consumer_id } = req.params;

  const { data, error } = await supabase
    .from("sales")
    .select(`
      *,
      consumers(cedula, nombre, departamento),
      products(id, name, entrepreneurships(id, name))
    `)
    .eq("consumer_id", consumer_id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

// [ADMIN] Obtener una venta por ID
export async function getSaleById(req: Request, res: Response) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("sales")
    .select(`
      *,
      consumers(cedula, nombre, departamento),
      products(id, name, entrepreneurships(id, name))
    `)
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Venta no encontrada" });
  res.status(200).json(data);
}

// [PÚBLICO] Crear una venta — parte del flujo de compra
export async function createSale(req: Request, res: Response) {
  const { consumer_id, product_id, quantity } = req.body;

  if (!consumer_id || !product_id || !quantity) {
    return res.status(400).json({ error: "Los campos consumer_id, product_id y quantity son obligatorios" });
  }

  if (quantity <= 0) {
    return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
  }

  // Obtenemos el producto para verificar stock y tomar el precio actual
  const { data: product } = await supabase
    .from("products")
    .select("id, price, current_stock, is_active")
    .eq("id", product_id)
    .single();

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  if (!product.is_active) {
    return res.status(400).json({ error: "El producto no está disponible" });
  }

  if (product.current_stock < quantity) {
    return res.status(400).json({ error: `Stock insuficiente. Stock disponible: ${product.current_stock}` });
  }

  // El precio unitario y el total se calculan en el servidor
  const unit_price = product.price;
  const total = unit_price * quantity;

  // Registramos la venta
  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .insert({
      consumer_id,
      product_id,
      quantity,
      unit_price,
      total,
      payroll_processed: false,
    })
    .select()
    .single();

  if (saleError) return res.status(400).json({ error: saleError.message });

  // Descontamos el stock
  const { error: stockError } = await supabase
    .from("products")
    .update({ current_stock: product.current_stock - quantity })
    .eq("id", product_id);

  if (stockError) {
    return res.status(500).json({ error: "Venta registrada pero hubo un error al actualizar el stock" });
  }

  res.status(201).json(sale);
}

// [ADMIN] Marcar una venta como procesada en nómina
export async function updatePayrollStatus(req: Request, res: Response) {
  const { id } = req.params;


  const { data: sale } = await supabase
    .from("sales")
    .select("id")
    .eq("id", id)
    .single();

  if (!sale) {
    return res.status(404).json({ error: "Venta no encontrada" });
  }

  const { data, error } = await supabase
    .from("sales")
    .update({ payroll_processed: true })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: "Estado de nómina actualizado correctamente", data });
}

// [IT] Eliminar una venta
export async function deleteSale(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "ID de venta inválido o ausente" });
  }

  try {
    const { error } = await supabase
      .from("sales")
      .delete()
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Venta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
}