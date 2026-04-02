import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getActiveProducts,
  getAllProducts,
  getProductById,
  getProductsByEntrepreneurship,
  updateProduct,
} from "../controllers/ProductController.ts";
import { authenticate } from "../middleware/auth.ts";
import { authorize } from "../middleware/role.ts";
import upload from "../middleware/upload.ts";

const productRouter: Router = Router();

// ── Ruta pública (catálogo) ──────────────────────────────────────────
productRouter.get("/public", getActiveProducts);

// ── Rutas protegidas ─────────────────────────────────────────────────
productRouter.use(authenticate);

productRouter.get("/", authorize("ADMIN", "IT"), getAllProducts);
productRouter.get(
  "/entrepreneurship/:entrepreneurship_id",
  getProductsByEntrepreneurship,
);
productRouter.get("/:id", getProductById);
productRouter.post(
  "/",
  authorize("PROVEEDOR", "IT"),
  upload.single("image"),
  createProduct,
);
productRouter.put(
  "/:id",
  authorize("ADMIN", "IT", "PROVEEDOR"),
  upload.single("image"),
  updateProduct,
);
productRouter.delete("/:id", authorize("IT"), deleteProduct);

export default productRouter;
