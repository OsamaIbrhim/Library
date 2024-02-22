// Profile.js
import React, { useEffect, useState } from "react";

const Profile = ({ token }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:6000/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error("Error fetching user profile");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserProfile();
  }, [token]);

  return (
    <div>
      {/* <h2>User Profile</h2>
      {user && (
        <div>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Age:</strong> {user.age}
          </p>
        </div>
      )} */}
      <h2>Profile</h2>
      <p>User profile information goes here</p>
    </div>
  );
};

export default Profile;
