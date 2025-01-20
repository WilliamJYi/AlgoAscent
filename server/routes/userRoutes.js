const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get All Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get User Based On ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Find user by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Handle case where user is not found
    }
    res.json(user); // Send the user data as JSON response
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle server errors
  }
});

// Add a New User
router.post("/", async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete User
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// Add an Application to a User
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from the request parameters
    const application = req.body; // Get application details from the request body

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Handle user not found
    }

    // Add the application to the user's applications array
    user.applications.push(application);

    // Save the updated user record
    const updatedUser = await user.save();

    res.status(200).json(updatedUser); // Return the updated user data
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle server errors
  }
});

// Delete an Application
router.delete("/:userId/applications/:applicationId", async (req, res) => {
  try {
    const { userId, applicationId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the application by ID
    user.applications = user.applications.filter(
      (app) => app._id.toString() !== applicationId
    );

    // Save the updated user record
    const updatedUser = await user.save();

    res.status(200).json(updatedUser); // Return updated user data
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
