import { Router } from "express";
import {
  createSystemUser,
  deleteUser,
  getActiveSessionsCount,
  getAllUsers,
  getPublicConsumers,
  getUserById,
  updateUser,
} from "../controllers/UserController.ts";
import { authenticate } from "../middleware/auth.ts";
import { authorize } from "../middleware/role.ts";

const userRouter: Router = Router();

// Todo lo que sigue requiere login
userRouter.get("/consumers", getPublicConsumers);
userRouter.use(authenticate);
userRouter.post("/", authorize("IT"), createSystemUser);
userRouter.get("/", getAllUsers);
userRouter.get("/active", getActiveSessionsCount);
userRouter.get("/:id", getUserById); // Cualquier usuario logueado puede ver perfiles
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", authorize("IT"), deleteUser); // Solo IT puede borrar

export default userRouter;
