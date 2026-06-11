import cors from "cors";
import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import authRouter from "./routes/authRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import composedProductRouter from "./routes/composedProductRoutes.js";
import configRouter from "./routes/configRoutes.js";
import entrepreneurshipRouter from "./routes/entrepreneurshipRoutes.js";
import productRouter from "./routes/productRoutes.js";
import saleRouter from "./routes/saleRoutes.js";
import softwareUpdatesRouter from "./routes/softwareUpdatesRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { loadAppConfig } from "./services/appConfigStore.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes, intente de nuevo más tarde" },
});
app.use("/api", limiter);

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de autenticación, intente de nuevo más tarde" },
});
app.use("/api/auth", authLimiter);

// Load app config on startup
loadAppConfig();

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/config", configRouter);
app.use("/api/entrepreneurships", entrepreneurshipRouter);
app.use("/api/products", productRouter);
app.use("/api/composed-products", composedProductRouter);
app.use("/api/sales", saleRouter);
app.use("/api/software-updates", softwareUpdatesRouter);

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Server Startup
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
