import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// API Routes
app.use("/api/users", userRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
