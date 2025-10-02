import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/userApi";
import { UserDataContext } from "../context/UserContext";

const UserLogout = () => {
  const { token, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setUser(null, null);
      navigate("/login");
      return;
    }

    logoutUser(token)
      .then(() => {
        setUser(null, null);
        navigate("/login");
      })
      .catch(() => {
        // Even if logout request fails, clear local and redirect
        setUser(null, null);
        navigate("/login");
      });
  }, [token, setUser, navigate]);

  return (
    <div className="h-screen flex items-center justify-center">Logging out...</div>
  );
};

export default UserLogout;
