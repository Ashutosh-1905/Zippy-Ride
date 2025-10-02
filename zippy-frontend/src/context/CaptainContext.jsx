import React, { createContext, useState, useCallback } from 'react';

export const CaptainDataContext = createContext();

const TOKEN_KEY = 'captainToken';
const CAPTAIN_KEY = 'captainData';

const CaptainContext = ({ children }) => {
  const [captain, setCaptainState] = useState(() => {
    const stored = localStorage.getItem(CAPTAIN_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setTokenState] = useState(() => localStorage.getItem(TOKEN_KEY) || '');

  // Memoize the setter function to avoid triggering unnecessary re-renders
  const setCaptain = useCallback((captainData, tokenData) => {
    if (captainData && tokenData) {
      setCaptainState(captainData);
      setTokenState(tokenData);
      localStorage.setItem(CAPTAIN_KEY, JSON.stringify(captainData));
      localStorage.setItem(TOKEN_KEY, tokenData);
    } else {
      setCaptainState(null);
      setTokenState('');
      localStorage.removeItem(CAPTAIN_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  return (
    <CaptainDataContext.Provider value={{ captain, token, setCaptain }}>
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContext;
