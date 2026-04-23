import { Router } from "express";
import { getAppConfig, getAvailableSheets, saveAppConfig } from "../controllers/AppConfigController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";

const configRouter: Router = Router();

configRouter.get("/", authenticate, authorize("ADMIN"), getAppConfig);
configRouter.post("/", authenticate, authorize("ADMIN"), saveAppConfig);
configRouter.get("/sheets", authenticate, authorize("ADMIN"), getAvailableSheets);

export default configRouter;