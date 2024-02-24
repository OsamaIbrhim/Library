import React, { useState } from "react";
import axios from "axios";

const Registration = ({}) => {
  const [userData, setUserData] = useState({});
  const [userType, setUserType] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "userType") {
      setUserType(value);
    } else if (name === "avatar") {
      setAvatar(e.target.files[0]);
    } else {
      setUserData({ ...userData, [name]: value });
    }
    // Check if passwords match
    if (name === "password" || name === "confirmPassword") {
      setPasswordsMatch(userData.password === userData.confirmPassword);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      if (!userData.name) {
        console.error("Name is required");
        return;
      }
      // Check if email is provided
      if (!userData.email) {
        console.error("Email is required");
        return; // Return early if email is missing
      }

      // Check if password is provided
      if (!userData.password) {
        console.error("Password is required");
        return; // Return early if password is missing
      }

      // Check if confirm password is provided and matches the password
      if (userData.password !== userData.confirmPassword) {
        setPasswordsMatch(false);
        return; // Return early if passwords do not match
      }

      // Check if userType is selected
      if (!userType) {
        console.error("User type is required");
        return; // Return early if userType is missing
      }

      // Proceed with registration if email, password, and userType are provided
      const formData = new FormData();
      formData.append("avatar", avatar);
      formData.append("name", userData.name);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("userType", userType);

      const response = await axios.post(
        "http://localhost:6000/users/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Registration</h2>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={userData.name || ""}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          type="text"
          name="email"
          value={userData.email || ""}
          onChange={handleChange}
        />
      </label>
      <label>
        Password:
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={userData.password}
          onChange={handleChange}
        />
      </label>
      <label>
        Confirm Password:
        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          value={userData.confirmPassword}
          onChange={handleChange}
        />
      </label>
      {!passwordsMatch && <span>Passwords do not match</span>}
      <div>
        <label>
          <input
            type="checkbox"
            onChange={togglePasswordVisibility}
            checked={showPassword}
          />
          Show Password
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            name="userType"
            value="user"
            checked={userType === "user"}
            onChange={handleChange}
          />
          Regular User
        </label>
        <label>
          <input
            type="radio"
            name="userType"
            value="author"
            checked={userType === "author"}
            onChange={handleChange}
          />
          Author
        </label>
      </div>
      <div>
        <label>
          Avatar Picture:
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
          />
        </label>
      </div>
      <button disabled={!passwordsMatch} onClick={handleRegistration}>
        Register
      </button>
    </div>
  );
};

export default Registration;
