import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const AuthComponent = () => {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  useEffect(() => {
    getAccess();
  }, []);
  const getAccess = async () => {
    try {
      const response = await fetch("/api/auth/auth-endpoint", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Cannot access page");
      }
      const data = await response.json();
      console.log(data);
      setMessage(data.message);
    } catch (error) {
      console.error("Error accessing page:", error);
    }
  };

  const handleLogout = () => {
    cookies.remove("TOKEN", { path: "/" });
    navigate("/");
  };

  return (
    <div>
      AuthComponent
      <h3 className="text-center text-danger">{message}</h3>
      <button type="submit" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default AuthComponent;
