import { Router } from "express";
import { getAllCategories } from "../controllers/CategoryController.js";

const categoryRouter: Router = Router();

categoryRouter.get("/", getAllCategories);

export default categoryRouter;
