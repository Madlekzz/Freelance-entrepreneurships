import { Router } from "express";
import { getCurrentMonthUpdates } from "../controllers/SoftwareUpdatesController.js";

const router: Router = Router();
router.get("/current-month", getCurrentMonthUpdates);

export default router;
