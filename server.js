require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db"); // Ensure this file connects MongoDB
const userRoutes = require("./routes/testRoute"); // Import your route

const app = express();

// Connect to MongoDB
connectDB();
const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json());
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes)
// Use Routes
app.use("/user", userRoutes); // Mount the routes at "/user"

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
