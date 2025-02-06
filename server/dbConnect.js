// external imports
const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/leaderboard";

const dbConnect = (async) => {
  mongoose
    .connect(DB_URI)
    .then(() => console.log("Successfully connected to MongoDB Atlas"))
    .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));
};

module.exports = dbConnect;
