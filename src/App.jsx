import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home/Home";
import AddUser from "./add-user/AddUser";
import UpdateUser from "./update-user/UpdateUser";
import ViewUser from "./view-user/ViewUser";
import Login from "./login/Login";
import CreateUser from "./create-user/CreateUser";
import Navbar from "./navbar/Navbar";
import ProtectedRoutes from "./auth/ProtectedRoutes";
import UserDashboard from "./user-dashboard/UserDashboard";
import VerifyEmail from "./verify-email/VerifyEmail";
import "./App.css";

function App() {
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
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* ✅ Corrected Protected Route Usage */}
        <Route
          path="/auth"
          element={
            <ProtectedRoutes>
              <UserDashboard />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
