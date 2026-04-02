import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRouter from "./routes/authRoutes.ts";
import entrepreneurshipRouter from "./routes/entrepreneurshipRoutes.ts";
import productRouter from "./routes/productRoutes.ts";
import saleRouter from "./routes/saleRoutes.ts";
import userRouter from "./routes/userRoutes.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/entrepreneurships", entrepreneurshipRouter);
app.use("/api/products", productRouter);
app.use("/api/sales", saleRouter);

// Server Startup
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
