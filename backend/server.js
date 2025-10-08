import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js"; // ✅ added this

dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes); // ✅ added profile route

// ✅ Root route (optional for testing)
app.get("/", (req, res) => {
  res.send("✅ SkillXchange backend is running...");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
