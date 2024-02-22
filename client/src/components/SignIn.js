import React, { useState } from "react";

const Signin = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("user");

  const handleRegistration = async (email, password) => {
    try {
      if (!name) {
        console.error("Name is required");
        return;
      }
      // Check if email is provided
      if (!email) {
        console.error("Email is required");
        return; // Return early if email is missing
      }

      // Check if password is provided
      if (!password) {
        console.error("Password is required");
        return; // Return early if password is missing
      }

      // Proceed with registration if email and password are provided
      const response = await fetch("http://localhost:6000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, userType }),
      });

      console.log("User type:", userType);
      console.log("Name:", name);
      console.log("Email:", email);
      console.log("Password", password);

      if (response.ok) {
        const { token } = await response.json(); // Extract token from response
        setToken(token);
        // Save token in localStorage for persistent login
        localStorage.setItem("token", token);
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleUserTypeChange = async (event) => {
    setUserType(event.target.value);
  };

  return (
    <div>
      <h2>Registration</h2>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
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
      <label>
        <input
          type="radio"
          value="user"
          checked={userType === "user"}
          onChange={handleUserTypeChange}
        />
        Regular User
      </label>
      <label>
        <input
          type="radio"
          value="author"
          checked={userType === "author"}
          onChange={handleUserTypeChange}
        />
        Author
      </label>
      <button onClick={() => handleRegistration(email, password)}>
        Register
      </button>
    </div>
  );
};

export default Signin;
