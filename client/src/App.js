import "./App.css";
import React, { useState } from "react";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Registration from "./components/Registration";
import Navbar from "./components/Navbar";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/profile/:username" element={<Profile token={token} />} />
        <Route path="/users/register" element={<Registration />} />
      </Routes>
    </Router>
  );
}

export default App;
