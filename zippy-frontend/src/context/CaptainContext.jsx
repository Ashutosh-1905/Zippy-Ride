import React, { createContext, useState } from 'react';

export const CaptainDataContext = createContext();

const TOKEN_KEY = 'captainToken';
const CAPTAIN_KEY = 'captainData';

const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(() => {
    const stored = localStorage.getItem(CAPTAIN_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');

  const setCaptainData = (captainData, tokenData) => {
    if (captainData && tokenData) {
      setCaptain(captainData);
      setToken(tokenData);
      localStorage.setItem(CAPTAIN_KEY, JSON.stringify(captainData));
      localStorage.setItem(TOKEN_KEY, tokenData);
    } else {
      setCaptain(null);
      setToken('');
      localStorage.removeItem(CAPTAIN_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  return (
    <CaptainDataContext.Provider value={{ captain, token, setCaptain: setCaptainData }}>
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContext;
