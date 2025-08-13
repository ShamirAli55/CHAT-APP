import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import connectDB from "./lib/db.js";
import cookieParser from 'cookie-parser'; 
import userRoutes from "./routes/user_route.js";
import chatRoutes from "./routes/chat_route.js";

const app = express();
dotenv.config();
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running on port :", PORT);
  connectDB();
});
