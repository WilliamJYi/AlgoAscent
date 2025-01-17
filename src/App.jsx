import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import viteLogo from "/vite.svg";
import Home from "./home/Home";
import AddUser from "./add-user/AddUser";
import UpdateUser from "./update-user/UpdateUser";
import "./App.css";
import ViewUser from "./view-user/ViewUser";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/add-user" element={<AddUser />}></Route>
        <Route path="/view-user/:id" element={<ViewUser />}></Route>
        <Route path="/update-user/:id" element={<UpdateUser />} />
      </Routes>
    </Router>
  );
}

export default App;
