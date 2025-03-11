import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CreateUser.css";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Password visibility state
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Confirm Password visibility state
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const { confirm_password, ...dataToSubmit } = formData;
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...dataToSubmit,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      console.log("Successfully registered!");
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      setMessage(
        "Verification email sent. Please check your inbox and verify your account."
      );
    } catch (error) {
      console.error("Error registering", error);
      alert("Error: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container">
      <h1>Join Board</h1>
      <div className="create-user-container">
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname || ""}
              onChange={handleChange}
              required
            ></input>
          </div>
          <div className="form-group">
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname || ""}
              onChange={handleChange}
              required
            ></input>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            ></input>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="create-user-password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                required
              ></input>
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Confirm Password</label>
            <div className="create-user-password-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password || ""}
                onChange={handleChange}
                required
              ></input>
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button className="submit-btn">Submit</button>
          <p className="signup-text">
            Have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
