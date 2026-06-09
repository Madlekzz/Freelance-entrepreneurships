# Branch: `feat/instant-payment` — Implementación de Pagos Inmediatos

## Resumen

Implementación del sistema de pagos inmediatos (efectivo, binance, pago móvil) vs crédito en la aplicación de ventas. Se agregaron los tipos `PaymentType` (`credit`, `immediate`) y `PaymentMethod` (`efectivo`, `binance`, `pago_movil`) a todas las capas: base de datos, backend, frontend types, hooks, componentes y exportación a Excel.

Incluye además la creación del agente **Delegator** como agente primario, la configuración de `opencode.json`, la sección **Skill Discovery** en `AGENTS.md`, y un componente `StatCard` reusable para unificar el diseño de tarjetas de estadísticas.

---

## 1. Base de datos

### `backend/migrations/006_payment_type.sql`
- Nueva columna `payment_type` ENUM (`credit`, `immediate`) en tabla `sales`
- Nueva columna `payment_method` ENUM (`efectivo`, `binance`, `pago_movil`) en tabla `sales`
- Nueva columna `entrepreneur_processed` (boolean) en `sale_items`
- Nueva columna `entrepreneur_processed_at` (timestamptz) en `sale_items`
- Default `payment_type = 'credit'` para ventas existentes

---

## 2. Backend

### `backend/src/schemas/schema.ts`
- Tipos exportados: `PaymentType`, `PaymentMethod`
- `Sale` interface: nuevos campos `payment_type`, `payment_method`

### `backend/src/controllers/SaleController.ts` (+153 líneas)
- `createSale`: recibe `payment_type` y `payment_method` opcionales (default `credit`)
- `processSaleItems`: nuevo endpoint para que emprendedores marquen items como procesados (pago inmediato recibido)
- `refundSale`: ya no destruye `total` en reembolso total (cambiado de `{ refunded: true, total: 0 }` a `{ refunded: true }`)
- `processSingleRefund`: mismo fix — preserva el `total` original
- Payroll guards (`updatePayrollStatus`): excluye ventas `immediate` de la nómina de administración
- `getAllSales`, `getSalesByEntrepreneurship`, `getSalesByConsumer`: incluyen `payment_type`, `payment_method` en queries

### `backend/src/routes/saleRoutes.ts` (+2 líneas)
- Ruta `POST /sales/:id/process-items` (procesar items de pago inmediato)

### `backend/src/schemas/emailTemplates.ts` (+35 líneas)
- Templates de email con placeholders `paymentType`, `paymentMethod`

### `backend/src/schemas/slackTemplates.ts` (+48 líneas)
- Templates de Slack con placeholders `paymentType`, `paymentMethod`

---

## 3. Frontend — Tipos

### `frontend/src/types/index.ts`
- `PaymentType = "credit" | "immediate"`
- `PaymentMethod = "efectivo" | "binance" | "pago_movil"`
- `CreateSalePayload`: nuevos campos opcionales `payment_type`, `payment_method`
- `Sale`, `EntrepreneurshipSale`, `GlobalSale`, `ConsumerSale`: nuevos campos `payment_type`, `payment_method`
- `SaleItem`, `SaleItemDetail`: nuevo campo `entrepreneur_processed`
- `SaleItemDetail`: nuevo campo `entrepreneur_processed_at`

---

## 4. Frontend — Hooks

### `frontend/src/hooks/useCheckout.ts` (+13 líneas)
- `paymentType` state + `setPaymentType`
- `paymentMethod` state + `setPaymentMethod`
- Se pasan al payload de `createSale`

### `frontend/src/hooks/useSales.ts` (+69 líneas)
- `paymentMethodFilter` state + lógica de filtro (5 valores: `all`, `credit`, `efectivo`, `binance`, `pago_movil`)
- `markItemsProcessed`: handler para procesar items de pago inmediato
- `filteredTotalRevenue`: ahora suma `sale_items.subtotal` en lugar de `s.total` (corrige total incorrecto en ventas multi-emprendimiento)
- Optimistic update en `markItemsRefunded`: ya no sobrescribe `total: 0` para reembolsos totales
- Status filter incluye lógica de ventas inmediatas en Pendientes

### `frontend/src/hooks/useAdminData.ts` (+89 líneas)
- `paymentMethodFilter` state + lógica de filtro
- Filtro "pending" ahora incluye ventas inmediatas no procesadas completamente
- Nuevo filtro "paid" para inmediatos procesados completamente
- Payroll excluye `payment_type === "immediate"`
- Eliminada lógica duplicada de fetch en `useEffect` — ahora usa `fetchData()` directamente
- Optimistic update en `markItemsRefunded`: ya no sobrescribe `total: 0`

### `frontend/src/hooks/useCustomerSales.ts` (+37 líneas)
- `paymentMethodFilter`, `paymentTypeFilter` → renombrado a `paymentMethodFilter`
- `statusFilter` + `setStatusFilter` exportados
- `getSaleStatus()` exportado para cálculo local de estadísticas
- Lógica de filtro por método de pago

### `frontend/src/hooks/useAdminConsumers.ts` (+25 líneas)
- `paymentMethodFilter` + lógica de filtro
- `toggleAllVisible` excluye inmediatos

### `frontend/src/hooks/useAdminEntrepreneurs.ts` (+2 líneas)
- `toggleAllVisible` excluye inmediatos

---

## 5. Frontend — Componentes Compartidos

### `frontend/src/components/shared/StatCard.tsx` (NUEVO)
Componente reusable para todas las tarjetas de estadísticas. Diseño unificado:
- `bg-white`, `rounded-2xl`, `border`, `p-4`, `shadow-sm`
- Valor en `font-black`, ícono + label sobre el valor
- Soporte para `opacity` condicional (cero-count)

### `frontend/src/components/shared/DetailedSalesStats.tsx` (+103 líneas)
- Migrado a `StatCard`
- **4 tarjetas** en lugar de 3: Total, Procesadas, **Pago Realizado** (nueva), Pendientes
- `paidFiltered`: inmediatos con todos los items `entrepreneur_processed`
- `pendingFiltered`: excluye inmediatos totalmente procesados
- `processedFiltered`: excluye `payment_type === "immediate"`

### `frontend/src/components/features/my-purchases/shared/StatusBadge.tsx` (+96 líneas)
- **Fuente de verdad única** para badges de estado/pago en toda la app
- `PaymentMethodBadge`: badge con ícono (efectivo💰, binance₿, pago_móvil📱, crédito💳)
- `PaymentTypeLabel`: label español ("Contado", "Crédito")
- Badges de estado: Pendiente, Pagado, Procesado, Parcial, Reembolsado
- `ProcessedIcon` (verde) para items procesados

---

## 6. Frontend — Checkout / Catálogo

### `frontend/src/pages/CatalogPage.tsx`
- Pasa `paymentType`, `setPaymentType`, `paymentMethod`, `setPaymentMethod` a `CheckoutModal`

### `frontend/src/components/features/catalog/CheckoutModal.tsx` (+90 líneas)
- Toggle de tipo de pago: Contado ↔ Crédito
- 3 tarjetas de método de pago (Efectivo, Binance, Pago Móvil)
- Scroll fix en el modal para móviles

---

## 7. Frontend — Mis Ventas (Emprendedor)

### `MySales.tsx` (+73 líneas)
- `ProcessItemsModal` integrado
- Handler `handleProcessItems`
- `filteredTotalRevenue`: suma `sale_items.subtotal` por emprendimiento

### `SalesTableDesktop.tsx` (+116 líneas)
- Columna "Tipo de Pago" con `PaymentTypeLabel`
- Badge "PAGADO" en items procesados
- Menú de tres puntos con acción "Procesar Item" para inmediatos

### `SalesCardMobile.tsx` (+91 líneas)
- Mismos cambios que desktop: tipo de pago, badge PAGADO, menú tres puntos

### `SalesFilters.tsx` (+38 líneas)
- Filtro combinado de tipo + método de pago (5 opciones: Todos, Efectivo, Binance, Pago Móvil, Crédito)

### `SalesSummary.tsx` (+44 líneas)
- Migrado a `StatCard` (2 tarjetas: Pendiente + Total Acumulado)
- `filteredTotalRevenue` corregido a `sale_items.subtotal`

### `ProcessItemsModal.tsx` (NUEVO)
- Modal visualmente idéntico a `RefundSaleModal`
- Checkboxes por item + confirmación
- Solo items de pago inmediato no procesados

---

## 8. Frontend — Mis Consumos

### `MyPurchases.tsx` (+184 líneas)
- 6 tarjetas `StatCard` con el nuevo diseño
- "Total General" movido al final del grid
- `statusFilter` con `FilterSelector` (Pendientes, Procesados, Pagados, Parciales, Reembolsados)
- Filtro combinado de método de pago

### `MyPurchasesDesktop.tsx` (+40 líneas)
- Columna "Tipo de Pago" con `PaymentTypeLabel`

### `MyPurchasesMobile.tsx` (+24 líneas)
- Tipo de pago en cada card

### `ConsumersMobile.tsx` (+39 líneas)
- Migrado a `StatCard`: Pendiente + Gasto Total

### `SummaryMobile.tsx` (+39 líneas)
- Migrado a `StatCard`: Pendiente + Total Acumulado

---

## 9. Frontend — Admin

### `AdminEntrepreneurs.tsx` (+2 líneas)
- Filtro "Reembolsado" agregado (mismo que admin-consumers)

### `AdminConsumers.tsx` (+4 líneas)
- `DetailedSalesStats` con nuevo esquema de 4 tarjetas

### `DetailedDesktop.tsx` (+94 líneas)
- Columna Tipo de Pago
- Badge PAGADO en items procesados
- Checkbox deshabilitado para inmediatos

### `DetailedMobile.tsx` (+174 líneas)
- Mismos cambios que desktop

### `ConsumerDetailedDesktop.tsx` (+190 líneas)
- StatusBadge, PaymentMethodBadge, PaymentTypeLabel
- Badges de estado unificados

### `ConsumerDetailedMobile.tsx` (+143 líneas)
- Mismos cambios que desktop

### `FilterSelector.tsx` (+10 líneas)
- Corregido para Ant Design v6 (menu-level `onClick` → key-based `onChange`)

### `EntrepreneursFilters.tsx` (+77 líneas)
- `paymentTypeFilter` renombrado a `paymentMethodFilter`
- Filtro status + método de pago

### `ConsumersFilter.tsx` (+114 líneas)
- Mismos cambios que EntrepreneursFilters

---

## 10. Frontend — Utilidades

### `frontend/src/utils/exportToExcel.ts` (+30 líneas)
- Nueva columna "Tipo de Pago" en exportación

### `frontend/src/services/saleService.ts` (+14 líneas)
- `processSaleItems`: API call al nuevo endpoint
- Tipos actualizados

---

## 11. Configuración del Proyecto

### `opencode.json` (NUEVO)
- `"default_agent": "delegator"`

### `.opencode/agents/delegator.md` (NUEVO)
- Agente primario que delega a sub-agentes siguiendo el SOP
- Workflow: Understand & Plan → Review → Implement → Review+Audit → Report

### `AGENTS.md`
- Nueva sección **Skill Discovery**
- SOP actualizado: paso 3 combina code-review + security-audit en paralelo
- Paso de documentación eliminado (bajo demanda del usuario)

### `.opencode/skills/sop/SKILL.md` (NUEVO)
- Skill SOP para code changes que referencia AGENTS.md

### `.agents/skills/find-skills/` (NUEVO)
- Skill de descubrimiento de skills para extender capacidades

### `skills-lock.json` (+6 líneas)
- Track de skills instalados

---

## Fixes incluidos

| Fix | Archivo(s) | Descripción |
|-----|-----------|-------------|
| Sale total preservado en refund | `backend/.../SaleController.ts` | Se eliminó `total: 0` del `UPDATE` en reembolso total (2 ubicaciones) |
| Optimistic update sin total: 0 | `frontend/src/hooks/useSales.ts`, `useAdminData.ts` | Se eliminó `total: allRefunded ? 0 : sale.total` del optimist update |
| filteredTotalRevenue correcto | `frontend/src/hooks/useSales.ts` | Ahora suma `sale_items.subtotal` en lugar de `s.total` |
| FilterSelector Ant Design v6 | `frontend/.../FilterSelector.tsx` | `onClick` en items → `onChange` en menu |
| paymentTypeFilter → paymentMethodFilter | Múltiples archivos | Renombrado para claridad semántica |
| Duplicate fetch en useAdminData | `frontend/src/hooks/useAdminData.ts` | Eliminado useEffect redundante |
| Pending filter incluye inmediatos | `useAdminData.ts`, `useSales.ts` | Ventas inmediatas no procesadas cuentan como pendientes |
| Pago Realizado filter | `DetailedSalesStats.tsx` | Nueva categoría para inmediatos procesados |
| Reembolsado filter en admin | `AdminEntrepreneurs.tsx` | Filtro de estado "Reembolsado" |
| StatCard unificado | Todos los resúmenes | Mismo diseño en toda la app |

---

## Verificación

- `cd backend && npx tsc --noEmit` — solo errores preexistentes (no relacionados)
- `cd frontend && npx tsc --noEmit` — sin errores
- `git diff --stat`: 39 archivos modificados, ~1711 inserciones, ~639 eliminaciones
