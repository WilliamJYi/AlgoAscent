const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const auth = require("../auth/Auth");

const router = express.Router();

router.post("/register", async (request, response) => {
  try {
    const { firstname, lastname, email, password } = request.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return response
        .status(400)
        .json({ message: "A user with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });

    await user.save();

    response.status(201).json({ message: "User Created Successfully", user });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Password was not hashed successfully", error });
  }
});

router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      "RANDOM-TOKEN",
      { expiresIn: "24h" }
    );
    response.status(200).json({
      message: "Login Successful",
      email: user.email,
      token,
    });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

// free endpoint
router.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access" });
});

// authentication endpoint
router.get("/auth-endpoint", auth, async (request, response) => {
  try {
    const user = await User.findById(request.user.userId).select("-password");

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    response.status(200).json({ message: "Authorized", user });
  } catch (error) {
    response
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
