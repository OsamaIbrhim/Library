import React, { useState } from "react";
import useHistory from "../hooks/useHistory";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { goTo } = useHistory(); // Initialize useHistory hook

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("http://localhost:6000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        // Save token in localStorage for persistent login
        localStorage.setItem("token", data.token);
        // Redirect to home page after successful login
        console.log("Login successful");
        goTo("/");
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <label>
        Email:
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
