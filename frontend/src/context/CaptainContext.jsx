import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
export const CaptainContext = createContext();

// This is the provider component
export const CaptainContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [captain, setCaptain] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load data from localStorage on initial render
    useEffect(() => {
        const storedCaptain = localStorage.getItem('captain');
        const storedToken = localStorage.getItem('token');
        if (storedCaptain && storedToken) {
            try {
                setCaptain(JSON.parse(storedCaptain));
                setToken(storedToken);
            } catch (error) {
                console.error('Failed to parse captain data from localStorage:', error);
                localStorage.removeItem('captain');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    // Function to handle login and save data
    const loginCaptain = (captainData, token) => {
        localStorage.setItem('captain', JSON.stringify(captainData));
        localStorage.setItem('token', token);
        setCaptain(captainData);
        setToken(token);
    };

    // Function to handle logout
    const logoutCaptain = () => {
        localStorage.removeItem('captain');
        localStorage.removeItem('token');
        setCaptain(null);
        setToken(null);
        navigate('/captain-login');
    };

    const value = {
        captain,
        setCaptain,
        token,
        setToken,
        loginCaptain,
        logoutCaptain,
        loading
    };

    return (
        <CaptainContext.Provider value={value}>
            {children}
        </CaptainContext.Provider>
    );
};