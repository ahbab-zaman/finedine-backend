import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import "./src/server.js";

dotenv.config();
connectDB();
