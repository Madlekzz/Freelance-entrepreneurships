import { Router } from "express";
import {
  getAllSales,
  getSalesByEntrepreneurship,
  getSalesByConsumer,
  getSaleById,
  createSale,
  updatePayrollStatus,
  deleteSale,
} from "../controllers/SaleController.ts";
import { authenticate } from "../middleware/auth.ts";
import { authorize } from "../middleware/role.ts";

const saleRouter: Router = Router();

// ── Ruta pública (flujo de compra) ───────────────────────────────────
saleRouter.post("/", createSale);

// ── Rutas protegidas ─────────────────────────────────────────────────
saleRouter.use(authenticate);

saleRouter.get("/", authorize("ADMIN"), getAllSales);
saleRouter.get("/entrepreneurship/:entrepreneurship_id", authorize('ADMIN'), getSalesByEntrepreneurship);
saleRouter.get("/consumer/:consumer_id", authorize("ADMIN"), getSalesByConsumer);
saleRouter.get("/:id", authorize("ADMIN"), getSaleById);
saleRouter.patch("/:id/payroll", authorize("ADMIN"), updatePayrollStatus);
saleRouter.delete("/:id", authorize("IT"), deleteSale);

export default saleRouter;