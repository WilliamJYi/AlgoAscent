const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  name: String,
  pattern: String,
  difficulty: String,
  completed: String,
  question_link: String,
  date_added: {
    type: Date,
    default: Date.now, // Default to the current date if not provided
  },
});

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exist"],
  },
  password: {
    type: String,
    required: [true, "Please provide a Password!"],
    unique: false,
  },
  verified: { type: Boolean, default: "false" },
  problems: [problemSchema],
  avatar: { type: String, default: "" },
  daily_goal: { type: Number, default: 15 },
  weekly_goal: { type: Number, default: 110 },
  date_joined: { type: Date, default: Date.now },
});

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
