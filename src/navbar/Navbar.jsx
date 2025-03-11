import React, { useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import "./Navbar.css";
import AuthContext from "../auth/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const { token, setToken, userData, setUserData } = useContext(AuthContext);

  useEffect(() => {}, [token]);

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
