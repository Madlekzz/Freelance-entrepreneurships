export const CONSUMER_PURCHASE_SUBJECT = "Confirmaci\u00F3n de Compra - Freelance LATAM";

export const consumerPurchaseEmailHtml = (
  name: string,
  orderId: string,
  total: number,
  items: Array<{ name: string; quantity: number; price: number }>,
): string => {
  const idParts = orderId.split("-");
  const displayId =
    idParts[0] && typeof idParts[0] === "string"
      ? idParts[0].toUpperCase()
      : "N/A";

  const itemsHtml = items
    .map(
      (p) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #e0e0e0;">${p.name}</td>
          <td style="padding:8px;border-bottom:1px solid #e0e0e0;text-align:center;">${p.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #e0e0e0;text-align:right;">$${p.price.toLocaleString()}</td>
          <td style="padding:8px;border-bottom:1px solid #e0e0e0;text-align:right;">$${(p.quantity * p.price).toLocaleString()}</td>
        </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:20px 0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#667eea,#764ba2);padding:30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;">&iexcl;Confirmaci&oacute;n de Compra!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;">
              <p style="margin:0 0 20px;font-size:16px;color:#333;">
                Hola <strong>${name}</strong>, gracias por tu apoyo a los emprendimientos.
              </p>
              <p style="margin:0 0 20px;font-size:14px;color:#666;">
                Orden: <strong>#${displayId}</strong>
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <thead>
                  <tr style="background-color:#f8f8f8;">
                    <th style="padding:10px;text-align:left;font-size:13px;color:#555;">Producto</th>
                    <th style="padding:10px;text-align:center;font-size:13px;color:#555;">Cant.</th>
                    <th style="padding:10px;text-align:right;font-size:13px;color:#555;">Precio</th>
                    <th style="padding:10px;text-align:right;font-size:13px;color:#555;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="padding:10px;text-align:right;font-weight:bold;font-size:16px;">Total Pagado:</td>
                    <td style="padding:10px;text-align:right;font-weight:bold;font-size:16px;color:#667eea;">$${total.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f8f8;padding:20px;text-align:center;font-size:12px;color:#999;">
              Freelance LATAM &mdash; Apoyando el emprendimiento local
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const ENTREPRENEUR_SALE_SUBJECT =
  "Nueva Venta Recibida - Freelance LATAM";

export const entrepreneurSaleEmailHtml = (
  ownerName: string,
  orderId: string,
  products: Array<{ name: string; quantity: number; price: number }>,
  customerName: string,
): string => {
  const subtotal = products.reduce(
    (acc, p) => acc + p.price * p.quantity,
    0,
  );

  const idParts = orderId.split("-");
  const displayId =
    idParts[0] && typeof idParts[0] === "string"
      ? idParts[0].toUpperCase()
      : "N/A";

  const itemsHtml = products
    .map(
      (p) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #e0e0e0;">${p.name}</td>
          <td style="padding:8px;border-bottom:1px solid #e0e0e0;text-align:center;">${p.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #e0e0e0;text-align:right;">$${p.price.toLocaleString()}</td>
          <td style="padding:8px;border-bottom:1px solid #e0e0e0;text-align:right;">$${(p.quantity * p.price).toLocaleString()}</td>
        </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:20px 0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#43e97b,#38f9d7);padding:30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;">&iexcl;Nueva Venta Recibida!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;">
              <p style="margin:0 0 20px;font-size:16px;color:#333;">
                Hola <strong>${ownerName}</strong>, <strong>${customerName}</strong> ha realizado una compra en tu emprendimiento.
              </p>
              <p style="margin:0 0 20px;font-size:14px;color:#666;">
                Orden: <strong>#${displayId}</strong>
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <thead>
                  <tr style="background-color:#f8f8f8;">
                    <th style="padding:10px;text-align:left;font-size:13px;color:#555;">Producto</th>
                    <th style="padding:10px;text-align:center;font-size:13px;color:#555;">Cant.</th>
                    <th style="padding:10px;text-align:right;font-size:13px;color:#555;">Precio</th>
                    <th style="padding:10px;text-align:right;font-size:13px;color:#555;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="padding:10px;text-align:right;font-weight:bold;font-size:16px;">Tu Ganancia:</td>
                    <td style="padding:10px;text-align:right;font-weight:bold;font-size:16px;color:#43e97b;">$${subtotal.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f8f8;padding:20px;text-align:center;font-size:12px;color:#999;">
              Freelance LATAM &mdash; Apoyando el emprendimiento local
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const REFUND_SUBJECT = "Reembolso - Freelance LATAM";

export const refundEmailHtml = (
  items: Array<{ quantity: number; unit_price: number; products: { name: string } }>,
  total: number,
  refundType: "full" | "partial",
): string => {
  const typeLabel = refundType === "full" ? "Reembolso Total" : "Reembolso Parcial";

  const itemsHtml = items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border-bottom:1px solid #e0e0e0;">${item.products.name}</td>
          <td style="padding:8px;border-bottom:1px solid #e0e0e0;text-align:center;">${item.quantity}</td>
          <td style="padding:8px;border-bottom:1px solid #e0e0e0;text-align:right;">$${item.unit_price.toLocaleString()}</td>
          <td style="padding:8px;border-bottom:1px solid #e0e0e0;text-align:right;">$${(item.quantity * item.unit_price).toLocaleString()}</td>
        </tr>`,
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:20px 0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#f093fb,#f5576c);padding:30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;">${typeLabel}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;">
              <p style="margin:0 0 20px;font-size:16px;color:#333;">
                Se ha procesado un reembolso por los siguientes items:
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <thead>
                  <tr style="background-color:#f8f8f8;">
                    <th style="padding:10px;text-align:left;font-size:13px;color:#555;">Producto</th>
                    <th style="padding:10px;text-align:center;font-size:13px;color:#555;">Cant.</th>
                    <th style="padding:10px;text-align:right;font-size:13px;color:#555;">Precio</th>
                    <th style="padding:10px;text-align:right;font-size:13px;color:#555;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="padding:10px;text-align:right;font-weight:bold;font-size:16px;">Total reembolsado:</td>
                    <td style="padding:10px;text-align:right;font-weight:bold;font-size:16px;color:#f5576c;">$${total.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colspan="4" style="padding:10px;text-align:right;font-size:13px;color:#666;">Tipo: <strong>${typeLabel}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f8f8;padding:20px;text-align:center;font-size:12px;color:#999;">
              Freelance LATAM &mdash; Apoyando el emprendimiento local
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

export const LOW_STOCK_SUBJECT = "Alerta de Stock Bajo - Freelance LATAM";

export const lowStockAlertEmailHtml = (
  ownerName: string,
  productName: string,
  entrepreneurshipName: string,
  currentStock: number,
): string => {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:20px 0;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#f093fb,#f5576c);padding:30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;">Alerta de Stock Bajo</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px;">
              <p style="margin:0 0 20px;font-size:16px;color:#333;">
                Hola <strong>${ownerName}</strong>, uno de tus productos tiene stock bajo:
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background-color:#f8f8f8;border-radius:6px;">
                <tr>
                  <td style="padding:15px;">
                    <p style="margin:0;font-size:14px;color:#666;"><strong>Producto:</strong> ${productName}</p>
                    <p style="margin:8px 0 0;font-size:14px;color:#666;"><strong>Emprendimiento:</strong> ${entrepreneurshipName}</p>
                    <p style="margin:8px 0 0;font-size:14px;color:#f5576c;"><strong>Stock actual:</strong> ${currentStock} unidades</p>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 0;font-size:13px;color:#999;">
                Por favor, rep&oacute;n el inventario pronto para evitar perder ventas.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f8f8;padding:20px;text-align:center;font-size:12px;color:#999;">
              Freelance LATAM &mdash; Apoyando el emprendimiento local
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
