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

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date_joined: { type: Date, required: true },
  applications: [applicationSchema],
  apps_today: { type: Number, default: 0 },
  daily_goal: { type: Number, default: 15 },
  apps_this_week: { type: Number, default: 0 },
  weekly_goal: { type: Number, default: 110 },
  total_apps: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", userSchema);
