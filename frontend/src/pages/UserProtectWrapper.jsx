import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProtectWrapper = ({ children }) => {
    const navigate = useNavigate();
    const { user, setUser, loading, logout } = useContext(UserDataContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.status === 200) {
                    setUser(response.data);
                }
            } catch (err) {
                console.error("Authentication failed:", err);
                logout();
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        if (loading) {
            // Wait for the context to finish loading from localStorage
            setIsLoading(true);
        } else if (!user) {
            // If context is loaded but no user is set, try fetching from API
            fetchUserProfile();
        } else {
            // User is already set, no need to fetch again
            setIsLoading(false);
        }
    }, [user, loading, navigate, setUser, logout]);

    if (isLoading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div>Loading user profile...</div>
            </div>
        );
    }

    return (
        <>
            {children}
        </>
    );
};

export default UserProtectWrapper;