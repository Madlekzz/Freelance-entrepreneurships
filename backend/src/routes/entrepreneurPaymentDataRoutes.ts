import { Router } from "express";
import {
  getBatchPaymentData,
  getMyPaymentData,
  upsertPaymentData,
} from "../controllers/EntrepreneurPaymentDataController.js";
import { authenticate } from "../middleware/auth.js";

const router: Router = Router();
router.use(authenticate);

router.get("/me", getMyPaymentData);
router.put("/:method", upsertPaymentData);
router.post("/batch", getBatchPaymentData);

export default router;
