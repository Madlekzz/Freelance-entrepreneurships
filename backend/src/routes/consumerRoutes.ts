import { Router } from "express";
import {
  getAllConsumers,
  getConsumerByCedula,
  createConsumer,
  updateConsumer,
  deleteConsumer,
} from "../controllers/ConsumerController.ts";
import { authenticate } from "../middleware/auth.ts";
import { authorize } from "../middleware/role.ts";

const consumerRouter: Router = Router();

// ── Ruta pública (flujo de compra) ───────────────────────────────────
consumerRouter.post("/", createConsumer);

// ── Rutas protegidas ─────────────────────────────────────────────────
consumerRouter.use(authenticate);

consumerRouter.get("/", authorize("ADMIN", "IT"), getAllConsumers);
consumerRouter.get("/:cedula", authorize("ADMIN", "IT"), getConsumerByCedula);
consumerRouter.put("/:cedula", authorize("ADMIN", "IT"), updateConsumer);
consumerRouter.delete("/:cedula", authorize("IT"), deleteConsumer);

export default consumerRouter;