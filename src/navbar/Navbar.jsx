import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import "./Navbar.css";
import AuthContext from "../auth/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const { token, setToken, userData, setUserData } = useContext(AuthContext);

  useEffect(() => {}, [token]);

  // // Function to check authentication status
  // const checkAuthStatus = async (userToken) => {
  //   if (!userToken) return;

  //   try {
  //     const response = await fetch("/api/auth/auth-endpoint", {
  //       method: "GET",
  //       headers: {
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     });
  //     if (!response.ok) {
  //       throw new Error("Cannot access page");
  //     }
  //     const data = await response.json();
  //     setUserData(data.user);
  //     setToken(userToken || null);
  //   } catch (error) {
  //     console.error("Error accessing page:", error);
  //     setUserData(null);
  //     setToken(null);
  //     cookies.remove("TOKEN", { path: "/" });
  //   }
  // };

  // // Check authentication status if token exists
  // useEffect(() => {
  //   console.log(token);
  //   if (token) {
  //     checkAuthStatus(token);
  //   }
  // }, [token]);

  // Logout function
  const handleLogout = () => {
    cookies.remove("TOKEN", { path: "/" });
    setToken(null);
    setUserData(null);
    navigate("/");
  };

  return (
    <div className="navbar">
      <h1 className="navbar-title">AlgoAscent</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {!token && <Link to="/create-user">Sign Up</Link>}
        {!token && <Link to="/login">Login</Link>}
        {token && userData && (
          <Link to="/auth">{userData.firstname + " " + userData.lastname}</Link>
        )}
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
