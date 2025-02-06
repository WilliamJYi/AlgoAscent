import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const ProtectedRoutes = ({ children }) => {
  const token = cookies.get("TOKEN");

  return token ? children : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
