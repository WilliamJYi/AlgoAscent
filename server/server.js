const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());

app.use(bodyParser.json());
app.use(express.json());

// User Routes
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes); // Mount the route at /users

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// Connect to MongoDB
const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/leaderboard";
mongoose
  .connect(DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Sample Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
