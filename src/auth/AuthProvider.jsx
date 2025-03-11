import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const cookies = new Cookies();
  const [token, setToken] = useState(cookies.get("TOKEN") || null);
  const [userData, setUserData] = useState();

  // Function to check authentication status
  const checkAuthStatus = async (userToken) => {
    if (!userToken) return;

    try {
      const response = await fetch("/api/auth/auth-endpoint", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Cannot access page");
      }

      const data = await response.json();
      setUserData(data.user);
      setToken(userToken || null);
    } catch (error) {
      console.error("Error accessing page:", error);
      setUserData(null);
      setToken(null);
      cookies.remove("TOKEN", { path: "/" });
    }
  };

  // Check authentication status if token exists
  useEffect(() => {
    if (token) {
      checkAuthStatus(token);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
