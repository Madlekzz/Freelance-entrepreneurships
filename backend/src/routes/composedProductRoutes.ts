import { Router } from "express";
import {
  createComposedProduct,
  deleteComposedProduct,
  getComposedProductById,
  getComposedProductsByEntrepreneurship,
  updateComposedProduct,
} from "../controllers/ComposedProductController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";
import upload from "../middleware/upload.js";

const composedProductRouter: Router = Router();

composedProductRouter.use(authenticate);

composedProductRouter.get(
  "/entrepreneurship/:entrepreneurship_id",
  getComposedProductsByEntrepreneurship,
);
composedProductRouter.get("/:id", getComposedProductById);
composedProductRouter.post(
  "/",
  authorize("PROVEEDOR", "IT"),
  upload.single("image"),
  createComposedProduct,
);
composedProductRouter.put(
  "/:id",
  authorize("ADMIN", "IT", "PROVEEDOR"),
  upload.single("image"),
  updateComposedProduct,
);
composedProductRouter.delete(
  "/:id",
  authorize("PROVEEDOR"),
  deleteComposedProduct,
);

export default composedProductRouter;
