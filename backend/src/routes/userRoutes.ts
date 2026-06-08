import { Router } from "express";
import {
  createSystemUser,
  deleteUser,
  getActiveSessionsCount,
  getAllUsers,
  getPublicConsumers,
  getUserById,
  updateUser,
} from "../controllers/UserController.js";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";

const userRouter: Router = Router();

// Todo lo que sigue requiere login
userRouter.get("/consumers", getPublicConsumers);
userRouter.use(authenticate);

userRouter.post("/", authorize("IT"), createSystemUser);
userRouter.get("/", authorize("IT", "ADMIN"), getAllUsers);
userRouter.get("/active", getActiveSessionsCount);
userRouter.get("/:id", authorize("IT", "ADMIN"), getUserById);
userRouter.put("/:id", authorize("IT", "ADMIN"), updateUser);
userRouter.delete("/:id", authorize("IT"), deleteUser);

export default userRouter;
