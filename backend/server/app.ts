import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import todoRoutes from "./routes/todo.routes";
import authRoutes from "./routes/auth.routes";
import authMW from "./middlewares/authmw";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/todos", authMW, todoRoutes);
app.use("/users", userRoutes);
app.use(authRoutes);

export default app;
