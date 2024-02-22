import "./App.css";
import React, { useState } from "react";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signin from "./components/SignIn";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <Router>
      <Routes>
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/profile/:username" element={<Profile token={token} />} />
        <Route path="/users/register" element={<Signin />} />
      </Routes>
    </Router>
  );
}

export default App;
