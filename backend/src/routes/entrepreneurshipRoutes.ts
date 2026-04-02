import { Router } from "express";
import {
  createEntrepreneurship,
  deleteEntrepreneurship,
  getActiveEntrepreneurships,
  getAllEntrepreneurships,
  getEntrepreneurshipById,
  getMyEntrepreneurships,
  updateEntrepreneurship,
} from "../controllers/EntrepreneurshipController.ts";
import { authenticate } from "../middleware/auth.ts";
import { authorize } from "../middleware/role.ts";

const entrepreneurshipRouter: Router = Router();

// ── Ruta pública (catálogo) ──────────────────────────────────────────
entrepreneurshipRouter.get("/public", getActiveEntrepreneurships);

// ── Rutas protegidas ─────────────────────────────────────────────────
entrepreneurshipRouter.use(authenticate);

entrepreneurshipRouter.get(
  "/",
  authorize("ADMIN", "IT"),
  getAllEntrepreneurships,
);
entrepreneurshipRouter.get("/me", getMyEntrepreneurships);
entrepreneurshipRouter.get("/:id", getEntrepreneurshipById);

entrepreneurshipRouter.post(
  "/",
  authorize("PROVEEDOR", "IT"),
  createEntrepreneurship,
);
entrepreneurshipRouter.put(
  "/:id",
  authorize("PROVEEDOR", "IT"),
  updateEntrepreneurship,
);
entrepreneurshipRouter.delete(
  "/:id",
  authorize("IT", "PROVEEDOR"),
  deleteEntrepreneurship,
);

export default entrepreneurshipRouter;
