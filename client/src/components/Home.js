import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h2>Home</h2>
      <p>Welcome to our site!</p>
      <Link to="/login">Login </Link>
      <Link to="/users/register"> Register</Link>
    </div>
  );
};

export default Home;
