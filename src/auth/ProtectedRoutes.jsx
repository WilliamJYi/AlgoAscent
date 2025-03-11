import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const ProtectedRoutes = ({ children }) => {
  const { token } = useContext(AuthContext);

  return token ? children : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
