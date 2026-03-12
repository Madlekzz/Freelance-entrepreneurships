import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.ts";
import cors from "cors";
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

// Server Startup
app.listen(PORT, () => {
	console.log(`Backend server running on http://localhost:${PORT}`);
});
