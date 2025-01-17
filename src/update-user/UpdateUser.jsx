import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateUser = () => {
  const { id } = useParams(); // Get the user ID from the route
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null); // State to hold user data
  const [formData, setFormData] = useState({}); // State for form inputs

  useEffect(() => {
    // Fetch user data by ID when component mounts
    const fetchUser = async () => {
      try {
        const response = await fetch(`/users/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await response.json();
        setUserData(data);
        setFormData(data); // Pre-fill the form with fetched user data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/users/${id}`, {
        method: "PUT", // Use PUT or PATCH for updating user
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      console.log("User updated successfully");
      navigate("/"); // Redirect back to the home page
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (!userData) {
    return <p>Loading user data...</p>; // Show loading message while data is fetched
  }

  return (
    <div>
      <h1>Update User</h1>
      <h2>Add Applications</h2>
      <form>
        <div>
          <label>Company:</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add</button>
      </form>
      <form>
        <div>
          <label>Role:</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add</button>
      </form>
      {/* <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Apps Today:</label>
          <input
            type="number"
            name="apps_today"
            value={formData.apps_today || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Daily Goal:</label>
          <input
            type="number"
            name="daily_goal"
            value={formData.daily_goal || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Apps This Week:</label>
          <input
            type="number"
            name="apps_this_week"
            value={formData.apps_this_week || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Weekly Goal:</label>
          <input
            type="number"
            name="weekly_goal"
            value={formData.weekly_goal || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Total Apps:</label>
          <input
            type="number"
            name="total_apps"
            value={formData.total_apps || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update User</button>
      </form> */}
    </div>
  );
};

export default UpdateUser;
