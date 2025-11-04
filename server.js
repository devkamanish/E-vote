import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import votesRoutes from "./routes/Vote.js"; 
import { fileURLToPath } from "url";
import path from "path";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/votes", votesRoutes); // new

app.get("/", (req, res) => res.send("Eoving Auth & Voting API Running..."));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
