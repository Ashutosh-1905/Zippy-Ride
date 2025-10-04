import React, { createContext, useState, useEffect } from "react";

export const CaptainDataContext = createContext();

export const CaptainProvider = ({ children }) => {
  const [captain, setCaptain] = useState(() => {
    const savedCaptain = localStorage.getItem("captain");
    return savedCaptain ? JSON.parse(savedCaptain) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  useEffect(() => {
    if (captain) localStorage.setItem("captain", JSON.stringify(captain));
    else localStorage.removeItem("captain");
  }, [captain]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const updateCaptain = (captainData, tokenData) => {
    setCaptain(captainData);
    setToken(tokenData);
  };

  return (
    <CaptainDataContext.Provider value={{ captain, token, setCaptain: updateCaptain, setToken }}>
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainProvider;
