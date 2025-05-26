"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const LandingPage = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await axios.get("/api/users/currentuser");
        setCurrentUser(data.currentUser);
      } catch (error) {
        console.log("Error fetching currentUser:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

export default LandingPage;
