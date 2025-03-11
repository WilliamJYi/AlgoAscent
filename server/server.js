const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes"); // Auth Routes
const userRoutes = require("./routes/userRoutes"); // User Routes
const dbConnect = require("./dbConnect"); // Database connection

const app = express();

// Increase the request body size limit to 10MB (adjust if needed)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Middleware
app.use(cors({ origin: "https://algoascent.vercel.app", credentials: true }));
app.use(bodyParser.json());
app.use(express.json());

// Mount routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// Connect to MongoDB
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Sample Route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
