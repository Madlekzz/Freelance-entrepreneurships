import { Router } from "express";
import {
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
} from "../controllers/UserController.ts";
import { authenticate } from "../middleware/auth.ts";
import { authorize } from "../middleware/role.ts";

const userRouter: Router = Router();

// Todo lo que sigue requiere login
userRouter.use(authenticate)
userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById); // Cualquier usuario logueado puede ver perfiles
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", authorize('IT'), deleteUser); // Solo IT puede borrar

export default userRouter;
