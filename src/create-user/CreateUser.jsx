import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CreateUser.css";
import Cookies from "universal-cookie";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({ firstname: "", lastname: "", email: "", password: "" });
    try {
      const response = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register");
      }

      console.log("Successfully registered");

      // Automatically log in the user
      const loginResponse = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!loginResponse.ok) {
        throw new Error("Login failed");
      }

      const loginData = await loginResponse.json();
      console.log("Successfully logged in");

      // Store token in cookies
      cookies.set("TOKEN", loginData.token, {
        path: "/",
        sameSite: "None",
        secure: true,
      });

      // Navigate to the home page
      navigate("/");
    } catch (error) {
      console.error("Error registering", error);
      alert("Error: " + error.message);
    }
    alert("Submitted");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container">
      <h1>Join Board</h1>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
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
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              required
            ></input>
          </div>
          {/* <div className="form-group">
            <label htmlFor="password">Confirm Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              required
            ></input>
          </div> */}

          <button>Join</button>
          <p className="signup-text">
            Have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
