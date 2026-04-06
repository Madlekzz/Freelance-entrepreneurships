import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRouter from "./routes/authRoutes.js";
import entrepreneurshipRouter from "./routes/entrepreneurshipRoutes.js";
import productRouter from "./routes/productRoutes.js";
import saleRouter from "./routes/saleRoutes.js";
import userRouter from "./routes/userRoutes.js";

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
