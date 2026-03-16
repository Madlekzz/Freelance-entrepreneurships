import { Router } from "express";
import {
  getActiveProducts,
  getAllProducts,
  getProductsByEntrepreneurship,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/ProductController.ts";
import { authenticate } from "../middleware/auth.ts";
import { authorize } from "../middleware/role.ts";

const productRouter: Router = Router();

// ── Ruta pública (catálogo) ──────────────────────────────────────────
productRouter.get("/public", getActiveProducts);

// ── Rutas protegidas ─────────────────────────────────────────────────
productRouter.use(authenticate);

productRouter.get("/", authorize("ADMIN", "IT"), getAllProducts);
productRouter.get("/entrepreneurship/:entrepreneurship_id", getProductsByEntrepreneurship);
productRouter.get("/:id", getProductById);
productRouter.post("/", authorize("PROVEEDOR", "IT"), createProduct);
productRouter.put("/:id", authorize("ADMIN", "IT", "PROVEEDOR"), updateProduct);
productRouter.delete("/:id", authorize("IT"), deleteProduct);

export default productRouter;