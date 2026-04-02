import { Router } from "express";
import {
	ApproveSignup,
	GetPendingRequests,
	Login,
	RejectSignup,
	SignupRequest,
} from "../controllers/AuthController.ts";
import { authenticate } from "../middleware/auth.ts";
import { authorize } from "../middleware/role.ts";

const authRouter: Router = Router();

// Rutas publicas
authRouter.post("/request-access", SignupRequest);
authRouter.post("/login", Login);

// Rutas protegidas
// authRouter.use(authenticate);
authRouter.use(authenticate);
authRouter.get("/pending-requests", authorize("IT"), GetPendingRequests);
authRouter.post("/approve-signup/:requestId", authorize("IT"), ApproveSignup);
authRouter.patch("/reject-signup/:requestId", authorize("IT"), RejectSignup);

export default authRouter;
