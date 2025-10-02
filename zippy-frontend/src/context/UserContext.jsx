import React, { createContext, useState, useCallback } from 'react';

export const UserDataContext = createContext();

const TOKEN_KEY = 'userToken';
const USER_KEY = 'userData';

const UserContext = ({ children }) => {
  const [user, setUser_] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken_] = useState(() => localStorage.getItem(TOKEN_KEY) || '');

  // Only create setUserData function once (memoized!)
  const setUserData = useCallback((userData, tokenData) => {
    if (userData && tokenData) {
      setUser_(userData);
      setToken_(tokenData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_KEY, tokenData);
    } else {
      setUser_(null);
      setToken_('');
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  return (
    <UserDataContext.Provider value={{ user, token, setUser: setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
