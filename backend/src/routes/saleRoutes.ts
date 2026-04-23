import { Router } from "express";
import {
  createSale,
  deleteSale,
  getAllSales,
  getSaleById,
  getSalesByConsumer,
  getSalesByEntrepreneurship,
  updatePayrollStatus,
  updatePayrollStatusBatch,
} from "../controllers/SaleController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";

const saleRouter: Router = Router();

// ── Ruta pública (flujo de compra) ───────────────────────────────────
saleRouter.post("/", createSale);

// ── Rutas protegidas ─────────────────────────────────────────────────
saleRouter.use(authenticate);

saleRouter.get("/", authorize("ADMIN"), getAllSales);
saleRouter.get(
  "/entrepreneurship/:entrepreneurship_id",
  authorize("ADMIN", "PROVEEDOR"),
  getSalesByEntrepreneurship,
);
saleRouter.get(
  "/consumer/:consumer_id",
  authorize("ADMIN"),
  getSalesByConsumer,
);
saleRouter.get("/:id", authorize("ADMIN"), getSaleById);
saleRouter.patch("/batch/payroll", authorize("ADMIN"), updatePayrollStatusBatch);
saleRouter.patch("/:id/payroll", authorize("ADMIN"), updatePayrollStatus);
saleRouter.delete("/:id", authorize("IT"), deleteSale);

export default saleRouter;
