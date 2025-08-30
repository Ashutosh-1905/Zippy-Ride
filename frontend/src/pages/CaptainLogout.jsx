import axios from "axios";
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainLogout = () => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);

  useEffect(() => {
    const logoutCaptain = async () => {
      const token = localStorage.getItem("token"); 

      try {
        await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Logout error:", err);
      } finally {
        // Clear token and captain context
        localStorage.removeItem("token");
        setCaptain(null);
        navigate("/captain-login");
      }
    };

    logoutCaptain();
  }, [navigate, setCaptain]);

  return <div>Logging out...</div>;
};

export default CaptainLogout;
