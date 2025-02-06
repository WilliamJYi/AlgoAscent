import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./home/Home";
import AddUser from "./add-user/AddUser";
import UpdateUser from "./update-user/UpdateUser";
import ViewUser from "./view-user/ViewUser";
import Login from "./login/Login";
import CreateUser from "./create-user/CreateUser";
import Navbar from "./navbar/Navbar";
import ProtectedRoutes from "./protected-routes/ProtectedRoutes";
import AuthComponent from "./user-dashboard/UserDashboard";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      {" "}
      {/* ✅ Move <Router> to wrap the entire application */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/view-user/:id" element={<ViewUser />} />
        <Route path="/update-user/:id" element={<UpdateUser />} />

        {/* ✅ Corrected Protected Route Usage */}
        <Route
          path="/auth"
          element={
            <ProtectedRoutes>
              <AuthComponent />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
