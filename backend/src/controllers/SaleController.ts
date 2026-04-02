import type { Request, Response } from "express";
import { supabaseAdmin } from "../db.ts";

// [ADMIN] Obtener todas las ventas
export async function getAllSales(req: Request, res: Response) {
  const { data, error } = await supabaseAdmin
    .from("sales")
    .select(
      `
        id,
        created_at,
        total,
        payroll_processed,
        users!consumer_id(id, name, email), 
        sale_items(
            quantity,
            unit_price,
            subtotal,
            products(id, name, entrepreneurships(id, name, owner_id))
        )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json(data);
}

// [ADMIN/PROVEEDOR] Obtener ventas por emprendimiento
export async function getSalesByEntrepreneurship(req: Request, res: Response) {
  const { entrepreneurship_id } = req.params;
  const requestingUser = req.user;

  // 1. Verificación de seguridad para PROVEEDOR
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
        error: "No tienes permiso para ver las ventas de este emprendimiento",
      });
    }
  }

  // 2. Consulta filtrando por los productos dentro de sale_items
  const { data, error } = await supabaseAdmin
    .from("sales")
    .select(
      `
            id,
            created_at,
            total,
            payroll_processed,
            users!consumer_id(id, name, email),
            sale_items!inner(
                quantity,
                unit_price,
                subtotal,
                products!inner(id, name, entrepreneurship_id)
            )
        `,
    )
    .eq("sale_items.products.entrepreneurship_id", entrepreneurship_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

// [ADMIN] Obtener ventas por consumidor
export async function getSalesByConsumer(req: Request, res: Response) {
  const { consumer_id } = req.params;

  const { data, error } = await supabaseAdmin
    .from("sales")
    .select(
      `
            id,
            created_at,
            total,
            payroll_processed,
            users!consumer_id(name),
            sale_items(
                quantity,
                unit_price,
                products(name, entrepreneurships(name))
            )
        `,
    )
    .eq("consumer_id", consumer_id)
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json(data);
}

// [ADMIN] Obtener una venta por ID
// [ADMIN] Obtener una venta por ID con todo su desglose
export async function getSaleById(req: Request, res: Response) {
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from("sales")
    .select(
      `
      id,
      created_at,
      total,
      payroll_processed,
      users!consumer_id(
        id, 
        name, 
        email,
        departamento
      ),
      sale_items(
        id,
        quantity,
        unit_price,
        subtotal,
        products(
          id, 
          name, 
          entrepreneurships(
            id, 
            name
          )
        )
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Venta no encontrada" });
  }

  res.status(200).json(data);
}

// [PÚBLICO] Crear una venta — Flujo de Carrito
export async function createSale(req: Request, res: Response) {
  const { consumer_id, items } = req.body; // items: [{ product_id, quantity }]

  if (!consumer_id || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Datos de compra inválidos" });
  }

  try {
    let totalAmount = 0;
    const processedItems = [];

    // 1. Validar todos los productos y calcular total
    for (const item of items) {
      const { data: product } = await supabaseAdmin
        .from("products")
        .select("id, price, current_stock, is_active")
        .eq("id", item.product_id)
        .single();

      if (
        !product ||
        !product.is_active ||
        product.current_stock < item.quantity
      ) {
        return res.status(400).json({
          error: `Producto ${item.product_id} no disponible o sin stock`,
        });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      processedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
        current_stock: product.current_stock,
      });
    }

    // 2. Crear la cabecera de la venta
    const { data: sale, error: saleError } = await supabaseAdmin
      .from("sales")
      .insert({
        consumer_id,
        total: totalAmount,
        payroll_processed: false,
      })
      .select()
      .single();

    if (saleError) throw saleError;

    // 3. Crear los detalles (sale_items)
    const itemsToInsert = processedItems.map((item) => ({
      sale_id: sale.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("sale_items")
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    res.status(201).json(sale);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// [ADMIN] Marcar una venta como procesada en nómina
// [ADMIN] Marcar una venta como procesada en nómina
export async function updatePayrollStatus(req: Request, res: Response) {
  const { id } = req.params;

  // Verificamos existencia
  const { data: sale, error: findError } = await supabaseAdmin
    .from("sales")
    .select("id")
    .eq("id", id)
    .single();

  if (findError || !sale) {
    return res.status(404).json({ error: "Venta no encontrada" });
  }

  // Actualizamos el booleano en la tabla maestra
  const { data, error } = await supabaseAdmin
    .from("sales")
    .update({ payroll_processed: true })
    .eq("id", id)
    .select(
      `
            id, 
            payroll_processed, 
            total,
            created_at
        `,
    )
    .single();

  if (error) return res.status(400).json({ error: error.message });

  res.status(200).json({
    message: "Estado de nómina actualizado correctamente",
    data,
  });
}

// [IT] Eliminar una venta
// [IT] Eliminar una venta y todos sus registros relacionados
export async function deleteSale(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID de venta requerido" });
  }

  try {
    const { error: itemsError } = await supabaseAdmin
      .from("sale_items")
      .delete()
      .eq("sale_id", id);

    if (itemsError) throw itemsError;

    // 2. Borrar la venta (Padre)
    const { error: saleError } = await supabaseAdmin
      .from("sales")
      .delete()
      .eq("id", id);

    if (saleError) return res.status(400).json({ error: saleError.message });

    res.status(200).json({
      message: "Venta y sus detalles eliminados correctamente",
    });
  } catch (error: any) {
    console.error("Delete Error:", error.message);
    res.status(500).json({ error: "Error interno al eliminar la venta" });
  }
}
