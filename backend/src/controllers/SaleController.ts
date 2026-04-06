import type { Request, Response } from "express";
import { supabaseAdmin } from "../db.ts";
import {
  consumerPurchaseTemplate,
  entrepreneurSaleTemplate,
} from "../schemas/slackTemplates.ts";
import {
  type SlackMessageContent,
  sendSlackNotification,
} from "../services/slackService.ts";

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

    // 1. Validar todos los productos, traer info de los emprendedores y calcular total
    for (const item of items) {
      const { data: product, error: prodError } = await supabaseAdmin
        .from("products")
        .select(
          `
          id, 
          name, 
          price, 
          current_stock, 
          is_active,
          entrepreneurship:entrepreneurship_id (
            id,
            name,
            owner:owner_id (
              id,
              email,
              name
            )
          )
        `,
        )
        .eq("id", item.product_id)
        .single();

      if (
        prodError ||
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
        ...product,
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
      .select(
        `
        id,
        total,
        consumer:consumer_id (
          id,
          email,
          name
        )
      `,
      )
      .single();

    if (saleError || !sale || !sale.id) throw saleError;

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

    // --- PROCESO DE NOTIFICACIONES ---

    const consumerData = Array.isArray(sale.consumer)
      ? sale.consumer[0]
      : sale.consumer;
    // A. Notificar al Consumidor
    if (consumerData?.email) {
      const consumerBlocks = consumerPurchaseTemplate(
        consumerData.name,
        sale.id,
        sale.total,
        processedItems,
      );

      const resSlack = await sendSlackNotification(
        consumerData.email,
        consumerBlocks,
      );

      await supabaseAdmin.from("notification_logs").insert({
        sale_id: sale.id,
        user_id: consumerData.id,
        slack_user_id: resSlack.slackUserId,
        message_type: "CUSTOMER_CONFIRMATION",
        message: consumerBlocks,
        status: resSlack.success ? "sent" : "error",
        error_message: resSlack.error,
      });
    }

    // B. Notificar a los Emprendedores (Agrupados por Owner)
    const sellersGroup = new Map<
      string,
      { email: string; name: string; products: any[] }
    >();

    processedItems.forEach((item) => {
      const owner = (item.entrepreneurship as any).owner;
      if (!sellersGroup.has(owner.id)) {
        sellersGroup.set(owner.id, {
          email: owner.email,
          name: owner.name,
          products: [],
        });
      }
      sellersGroup.get(owner.id)?.products.push(item);
    });

    for (const [ownerId, data] of sellersGroup.entries()) {
      const sellerBlocks = entrepreneurSaleTemplate(
        data.name,
        sale.id,
        data.products,
        consumerData?.name,
      );

      const resSlackSeller = await sendSlackNotification(
        data.email,
        sellerBlocks,
      );

      await supabaseAdmin.from("notification_logs").insert({
        sale_id: sale.id,
        user_id: ownerId,
        slack_user_id: resSlackSeller.slackUserId,
        message_type: "ENTREPRENEUR_SALE",
        message: sellerBlocks,
        status: resSlackSeller.success ? "sent" : "error",
        error_message: resSlackSeller.error,
      });
    }

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
