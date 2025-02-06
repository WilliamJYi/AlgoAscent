const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  company: String,
  position: String,
  jobLink: String,
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
  applications: [applicationSchema],
  daily_goal: { type: Number, default: 15 },
  weekly_goal: { type: Number, default: 110 },
  date_joined: { type: Date, default: Date.now },
});

module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
