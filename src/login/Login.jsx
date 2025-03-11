import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import "./Login.css";
import AuthContext from "../auth/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Password visibility state
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const cookies = new Cookies();
  const { token, setToken, useData, setUserData } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const data = await response.json();
      console.log(data);

      if (!data.verified) {
        setMessage("Please verify your email before logging in.");
        return;
      }

      cookies.set("TOKEN", data.token, {
        path: "/",
        sameSite: "None",
        secure: true,
      });

      setToken(data.token);

      // alert("Login Successful");
      setFormData({ email: "", password: "" });
      navigate("/");
    } catch (error) {
      console.error("Error logging in", error);
      setMessage("Login failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container">
      <h1>Login page</h1>
      <div className="login-container">
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"} // Toggle visibility
                id="password"
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <button className="submit-btn">Login</button>
          <p className="signup-text">
            Don't have an account? <Link to="/create-user">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
