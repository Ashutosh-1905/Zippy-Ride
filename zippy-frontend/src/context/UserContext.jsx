import React, { createContext, useState } from 'react';

export const UserDataContext = createContext();

const TOKEN_KEY = 'token';
const USER_KEY = 'userData';

const UserContext = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');

  const setUserData = (userData, tokenData) => {
    if (userData && tokenData) {
      setUser(userData);
      setToken(tokenData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_KEY, tokenData);
    } else {
      setUser(null);
      setToken('');
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  return (
    <UserDataContext.Provider value={{ user, token, setUser: setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
