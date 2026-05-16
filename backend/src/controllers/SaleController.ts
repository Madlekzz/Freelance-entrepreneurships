import type { Request, Response } from "express";
import { supabaseAdmin } from "../db.js";
import {
  consumerPurchaseTemplate,
  entrepreneurSaleTemplate,
  saleNotificationTemplate,
} from "../schemas/slackTemplates.js";
import { isGoogleSheetsConfigured } from "../services/googleSheetsConfig.js";
import {
  findFreelancerRow,
  updateEntrepreneurEarnings,
  updateEntrepreneurshipSpent,
} from "../services/googleSheetsService.js";
import { sendSlackNotification, sendSlackWebhookNotification, checkAndNotifyLowStock } from "../services/slackService.js";

interface ProductInfo {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  price: number;
}

interface ProcessedItem extends ProductInfo {
  product_id: string;
  quantity: number;
  unit_price: number;
  name: string;
  price: number;
  owner_id: string;
  owner_email: string;
  owner_name: string;
}

interface SellerGroup {
  email: string;
  name: string;
  products: ProductInfo[];
}

// [ADMIN] Obtener todas las ventas
export async function getAllSales(_req: Request, res: Response) {
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
            products(id, name, entrepreneurships(id, name, owner_id, users(name)))
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
    const processedItems: ProcessedItem[] = [];

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

      const entData = product.entrepreneurship as unknown as {
        owner: { id: string; email: string; name: string };
      };
      const owner = entData.owner;

      processedItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: product.price,
        name: product.name,
        price: product.price,
        owner_id: owner.id,
        owner_email: owner.email,
        owner_name: owner.name,
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
    // Separamos en try-catch para que errores en notificaciones no fallen toda la venta

    const consumerData = Array.isArray(sale.consumer)
      ? sale.consumer[0]
      : sale.consumer;

    // A. Notificar al Consumidor
    try {
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
    } catch (notifyErr) {
      console.error("Error notifying consumer:", notifyErr);
    }

    // B. Notificar a los Emprendedores (Agrupados por Owner)
    try {
      const sellersGroup = new Map<string, SellerGroup>();

      processedItems.forEach((item) => {
        if (!sellersGroup.has(item.owner_id)) {
          sellersGroup.set(item.owner_id, {
            email: item.owner_email,
            name: item.owner_name,
            products: [],
          });
        }
        sellersGroup.get(item.owner_id)?.products.push({
          product_id: item.product_id,
          name: item.name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          price: item.unit_price,
        });
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
    } catch (notifyErr) {
      console.error("Error notifying entrepreneurs:", notifyErr);
    }

    try {
      const stockCheckItems = processedItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      const { data: products } = await supabaseAdmin
        .from("products")
        .select("id, current_stock")
        .in(
          "id",
          stockCheckItems.map((i) => i.product_id),
        );

      if (products) {
        const productsToCheck = products.map((p) => {
          const soldItem = stockCheckItems.find(
            (i) => i.product_id === p.id,
          );
          return {
            product_id: p.id,
            new_stock: p.current_stock - (soldItem?.quantity || 0),
          };
        });

        await checkAndNotifyLowStock(productsToCheck);
      }
    } catch (stockErr) {
      console.error("Error checking low stock:", stockErr);
    }

    // C. Notificar al canal de Slack vía webhook
    try {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL_IT;
      if (webhookUrl) {
        const sellersForNotification: Array<{
          name: string;
          products: Array<{ name: string; quantity: number; price: number }>;
          subtotal: number;
        }> = [];

        const sellersGroupForWebhook = new Map<string, SellerGroup>();

        processedItems.forEach((item) => {
          if (!sellersGroupForWebhook.has(item.owner_id)) {
            sellersGroupForWebhook.set(item.owner_id, {
              email: item.owner_email,
              name: item.owner_name,
              products: [],
            });
          }
          sellersGroupForWebhook.get(item.owner_id)?.products.push({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            price: item.price,
            name: item.name,
          });
        });

        for (const [, data] of sellersGroupForWebhook.entries()) {
          const subtotal = data.products.reduce(
            (acc: number, p) => acc + p.price * p.quantity,
            0,
          );
          sellersForNotification.push({
            name: data.name,
            products: data.products.map((p) => ({
              name: p.name,
              quantity: p.quantity,
              price: p.price,
            })),
            subtotal,
          });
        }

        const webhookBlocks = saleNotificationTemplate(
          consumerData?.name || "Cliente",
          sale.id,
          sale.total,
          processedItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          sellersForNotification,
        );

        await sendSlackWebhookNotification(webhookUrl, webhookBlocks);
      }
    } catch (webhookErr) {
      console.error("Error sending webhook notification:", webhookErr);
    }

    res.status(201).json(sale);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error al insertar la venta o sus detalles en la base de datos";
    console.error("Error al crear venta:", message);
    res.status(500).json({ error: `Error al procesar la compra: ${message}` });
  }
}

// [ADMIN] Marcar una venta como procesada en nómina
export async function updatePayrollStatus(req: Request, res: Response) {
  const { id } = req.params;

  const { data: sale, error: findError } = await supabaseAdmin
    .from("sales")
    .select("id")
    .eq("id", id)
    .single();

  if (findError || !sale) {
    return res.status(404).json({ error: "Venta no encontrada" });
  }

  const { data, error } = await supabaseAdmin
    .from("sales")
    .update({ payroll_processed: true })
    .eq("id", id)
    .select(
      `
        id, 
        payroll_processed, 
        total,
        created_at,
        users!consumer_id(id, name, email),
        sale_items(
          subtotal,
          products(id, name, entrepreneurships(id, name, owner_id, users(id, name, email)))
        )
      `,
    )
    .single();

  if (error) return res.status(400).json({ error: error.message });

  const saleData = data as unknown as {
    users: { name: string; email: string } | { name: string; email: string }[];
    sale_items: {
      subtotal: number;
      products: {
        entrepreneurships: {
          name: string;
          owner_id: string;
          users:
            | { name: string; email: string }
            | { name: string; email: string }[];
        };
      };
    }[];
  };

  const usersData = saleData.users;
  const consumerName = Array.isArray(usersData)
    ? usersData[0]?.name
    : usersData?.name;
  const consumerEmail = Array.isArray(usersData)
    ? usersData[0]?.email
    : usersData?.email;

  const entrepreneurshipTotals: Record<string, number> = {};
  for (const item of saleData.sale_items || []) {
    const entData = item.products?.entrepreneurships;
    const entrepreneurshipName = Array.isArray(entData)
      ? entData[0]?.name
      : entData?.name;
    if (entrepreneurshipName) {
      entrepreneurshipTotals[entrepreneurshipName] =
        (entrepreneurshipTotals[entrepreneurshipName] || 0) + item.subtotal;
    }
  }

  if (
    isGoogleSheetsConfigured() &&
    consumerName &&
    consumerEmail &&
    Object.keys(entrepreneurshipTotals).length > 0
  ) {
    try {
      const rowNumber = await findFreelancerRow(consumerName, consumerEmail);
      if (rowNumber !== null) {
        for (const [entrepreneurshipName, total] of Object.entries(
          entrepreneurshipTotals,
        )) {
          await updateEntrepreneurshipSpent(
            rowNumber,
            entrepreneurshipName,
            total,
          );
        }
      }

      for (const item of saleData.sale_items || []) {
        const entData = item.products?.entrepreneurships;
        const entrepreneurshipName = Array.isArray(entData)
          ? entData[0]?.name
          : entData?.name;
        const ownerData = Array.isArray(entData)
          ? entData[0]?.users
          : entData?.users;
        const ownerEmail = Array.isArray(ownerData)
          ? ownerData[0]?.email
          : ownerData?.email;
        if (entrepreneurshipName && ownerEmail && item.subtotal) {
          await updateEntrepreneurEarnings(
            entrepreneurshipName,
            ownerEmail,
            item.subtotal,
          );
        }
      }
    } catch (sheetsError) {
      console.error("Error actualizando Google Sheets:", sheetsError);
    }
  }

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
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error al eliminar los registros relacionados de la venta";
    console.error("Error al eliminar venta:", message);
    res.status(500).json({ error: `Error al eliminar la venta: ${message}` });
  }
}

// [ADMIN] Batch process multiple sales for payroll
export async function updatePayrollStatusBatch(req: Request, res: Response) {
  const { saleIds } = req.body;

  if (!saleIds || !Array.isArray(saleIds) || saleIds.length === 0) {
    return res.status(400).json({ error: "IDs de ventas requeridos" });
  }

  try {
    const results: { saleId: string; success: boolean; error?: string }[] = [];

    for (const saleId of saleIds) {
      try {
        await processSinglePayroll(saleId);
        results.push({ saleId, success: true });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido";
        results.push({ saleId, success: false, error: message });
      }
    }

    const failed = results.filter((r) => !r.success);
    if (failed.length > 0) {
      return res.status(207).json({
        message: `Procesadas ${results.length - failed.length} ventas, ${failed.length} fallidas`,
        results,
      });
    }

res.status(200).json({
      message: "Todas las ventas procesadas correctamente",
      results,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Error al actualizar el estado de procesamiento de las ventas";
    console.error("Error al procesar nómina batch:", message);
    res.status(500).json({ error: `Error al procesar la nómina: ${message}` });
  }
}

async function processSinglePayroll(saleId: string) {
  const { data: sale, error: findError } = await supabaseAdmin
    .from("sales")
    .select("id")
    .eq("id", saleId)
    .single();

  if (findError || !sale) {
    throw new Error("Venta no encontrada");
  }

  const { data, error } = await supabaseAdmin
    .from("sales")
    .update({ payroll_processed: true })
    .eq("id", saleId)
    .select(
      `
        id,
        payroll_processed,
        total,
        created_at,
        users!consumer_id(id, name, email),
        sale_items(
          subtotal,
          products(id, name, entrepreneurships(id, name, owner_id, users(id, name, email)))
        )
      `,
    )
    .single();

  if (error) throw error;

  const saleData = data as unknown as {
    users: { name: string; email: string } | { name: string; email: string }[];
    sale_items: {
      subtotal: number;
      products: {
        entrepreneurships: {
          name: string;
          owner_id: string;
          users: { name: string; email: string } | { name: string; email: string }[];
        };
      };
    }[];
  };

  const usersData = saleData.users;
  const consumerName = Array.isArray(usersData) ? usersData[0]?.name : usersData?.name;
  const consumerEmail = Array.isArray(usersData) ? usersData[0]?.email : usersData?.email;

  const entrepreneurshipTotals: Record<string, number> = {};
  for (const item of saleData.sale_items || []) {
    const entData = item.products?.entrepreneurships;
    const entrepreneurshipName = Array.isArray(entData) ? entData[0]?.name : entData?.name;
    if (entrepreneurshipName) {
      entrepreneurshipTotals[entrepreneurshipName] = (entrepreneurshipTotals[entrepreneurshipName] || 0) + item.subtotal;
    }
  }

  if (isGoogleSheetsConfigured() && consumerName && consumerEmail && Object.keys(entrepreneurshipTotals).length > 0) {
    const rowNumber = await findFreelancerRow(consumerName, consumerEmail);
    if (rowNumber !== null) {
      for (const [entrepreneurshipName, total] of Object.entries(entrepreneurshipTotals)) {
        await updateEntrepreneurshipSpent(rowNumber, entrepreneurshipName, total);
      }
    }

    for (const item of saleData.sale_items || []) {
      const entData = item.products?.entrepreneurships;
      const entrepreneurshipName = Array.isArray(entData) ? entData[0]?.name : entData?.name;
      const ownerData = Array.isArray(entData) ? entData[0]?.users : entData?.users;
      const ownerEmail = Array.isArray(ownerData) ? ownerData[0]?.email : ownerData?.email;
      if (entrepreneurshipName && ownerEmail && item.subtotal) {
        await updateEntrepreneurEarnings(entrepreneurshipName, ownerEmail, item.subtotal);
      }
    }
  }
}
