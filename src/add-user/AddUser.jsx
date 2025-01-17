import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    date_joined: new Date().toISOString().slice(0, 10),
    apps_today: 0,
    daily_goal: 15,
    apps_this_week: 0,
    weekly_goal: 110,
    total_apps: 0,
  }); // have a template for this

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add new user");
      }
      console.log("Successfully added new user");
      navigate("/"); // Go back to home page
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  return (
    <div>
      <h1>Join the Leaderboard</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Daily Goal:</label>
          <input
            type="number"
            name="daily_goal"
            value={formData.daily_goal}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Weekly Goal:</label>
          <input
            type="number"
            name="weekly_goal"
            value={formData.weekly_goal}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddUser;
