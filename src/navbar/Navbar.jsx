import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [token, setToken] = useState(null);

  // Function to check authentication status
  const checkAuthStatus = () => {
    const userToken = cookies.get("TOKEN");
    setToken(userToken || null);
  };

  // Effect to check token at an interval (ensures updates on login/logout)
  useEffect(() => {
    checkAuthStatus(); // Run on mount

    const interval = setInterval(() => {
      checkAuthStatus(); // Run periodically to detect cookie changes
    }, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Redirect to home if user logs out
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token]);

  // Logout function
  const handleLogout = () => {
    cookies.remove("TOKEN", { path: "/" });
    setToken(null); // Update state immediately
    navigate("/");
  };

  return (
    <div className="navbar">
      <h1 className="navbar-title">Job Application Leaderboard</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {!token && <Link to="/create-user">Sign Up</Link>}
        {!token && <Link to="/login">Login</Link>}
        {token && <Link to="/auth">Dashboard</Link>}
        {token && (
          <Link onClick={handleLogout} to="/auth">
            Log out
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
