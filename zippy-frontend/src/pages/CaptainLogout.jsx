import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logoutCaptain } from "../api/auth/captainApi";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainLogout = () => {
  const { token, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setCaptain(null, null);
      navigate("/captain-login");
      return;
    }

    logoutCaptain(token)
      .then(() => {
        setCaptain(null, null);
        navigate("/captain-login");
      })
      .catch(() => {
        setCaptain(null, null);
        navigate("/captain-login");
      });
  }, [token, setCaptain, navigate]);

  return (
    <div className="h-screen flex items-center justify-center">Logging out...</div>
  );
};

export default CaptainLogout;
