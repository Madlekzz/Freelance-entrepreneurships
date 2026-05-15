import type { SlackMessageContent } from "../services/slackService.ts";

/**
 * Plantilla para notificaciones de solicitudes de registro (IT)
 */
export const signupRequestTemplate = (
  userName: string,
  email: string,
  entrepreneurshipName: string = "",
  roles: string[],
): SlackMessageContent => {
  const rolesText = roles.map((r) => `• ${r}`).join("\n");

  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "Nueva Solicitud de Registro",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Se ha recibido una nueva solicitud de registro:\n\n*Nombre:* ${userName}\n*Email:* ${email}\n${entrepreneurshipName ? `*Emprendimiento:* ${entrepreneurshipName}\n` : ""}`,
      },
    },
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Roles solicitados:*\n${rolesText}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `_Revisa la solicitud en el panel de IT para aprobarla o rechazarla._`,
      },
    },
  ];
};

/**
 * Plantilla para la confirmación de compra del Consumidor
 */
export const consumerPurchaseTemplate = (
  name: string,
  orderId: string = "",
  total: number,
  items: any[],
): SlackMessageContent => {
  const idParts = orderId.split("-");

  // 2. Extraemos el primer elemento
  const firstPart = idParts[0];

  // 3. Verificamos que firstPart sea un string y no esté vacío
  // Esto hace "narrowing" y garantiza que NO sea undefined para el .toUpperCase()
  const displayId =
    firstPart && typeof firstPart === "string"
      ? firstPart.toUpperCase()
      : "N/A";

  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "¡Confirmación de Compra! 🛍️",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Hola *${name}*, gracias por tu apoyo a los emprendimientos.\n*Orden:* \`#${displayId}\``,
      },
    },
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*Resumen de productos:*\n" +
          items
            .map(
              (p) =>
                `• ${p.name} | *${p.quantity}* x $${p.price.toLocaleString()} = *$${(
                  p.quantity * p.price
                ).toLocaleString()}*`,
            )
            .join("\n"),
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Total Pagado:* ✨ *$${total.toLocaleString()}*`,
        },
      ],
    },
  ];
};

/**
 * Plantilla para el aviso de venta del Emprendedor
 */
export const entrepreneurSaleTemplate = (
  ownerName: string,
  orderId: string = "",
  products: any[],
  customerName: string,
): SlackMessageContent => {
  const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

  const idParts = orderId.split("-");

  // 2. Extraemos el primer elemento
  const firstPart = idParts[0];

  // 3. Verificamos que firstPart sea un string y no esté vacío
  // Esto hace "narrowing" y garantiza que NO sea undefined para el .toUpperCase()
  const displayId =
    firstPart && typeof firstPart === "string"
      ? firstPart.toUpperCase()
      : "N/A";

  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "¡Nueva Venta Recibida! 🎉",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Hola *${ownerName}*, *${customerName}* ha realizado una compra en tu emprendimiento.\n*Orden:* \`#${displayId}\``,
      },
    },
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*Tus productos vendidos:*\n" +
          products
            .map(
              (p) =>
                `• ${p.name} | *${p.quantity}* x $${p.price.toLocaleString()} = *$${(p.quantity * p.price).toLocaleString()}*`,
            )
            .join("\n"),
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Tu ganancia:* *$${subtotal.toLocaleString()}*`,
        },
      ],
    },
  ];
};

export const lowStockAlertTemplate = (
  ownerName: string,
  productName: string,
  entrepreneurshipName: string,
  currentStock: number,
): SlackMessageContent => {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "⚠️ Alerta de Stock Bajo",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Hola *${ownerName}*, uno de tus productos tiene stock bajo:\n\n*Producto:* ${productName}\n*Emprendimiento:* ${entrepreneurshipName}\n*Stock actual:* ${currentStock} unidades`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "_Por favor, repón el inventario pronto para evitar perder ventas._",
      },
    },
  ];
};
