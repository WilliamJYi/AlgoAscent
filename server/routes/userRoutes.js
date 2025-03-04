const express = require("express");
const User = require("../models/UserModel");

const router = express.Router();

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

// Add an Problem to a User
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from the request parameters
    const problem = req.body; // Get problem details from the request body

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Handle user not found
    }

    // Add the problem to the user's problems array
    user.problems.push(problem);

    // Save the updated user record
    const updatedUser = await user.save();

    res.status(200).json(updatedUser); // Return the updated user data
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle server errors
  }
});

// Update user avatar
router.put("/:id/avatar", async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(404).json({ message: "No image provided" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatar = avatar;
    const updatedUser = await user.save();

    res.status(200).json(updatedUser); // Return the updated user data
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle server errors
  }
});

// Delete an Problem
router.delete("/:userId/problems/:problemId", async (req, res) => {
  try {
    const { userId, problemId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the problem by ID
    user.problems = user.problems.filter(
      (app) => app._id.toString() !== problemId
    );

    // Save the updated user record
    const updatedUser = await user.save();

    res.status(200).json(updatedUser); // Return updated user data
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
