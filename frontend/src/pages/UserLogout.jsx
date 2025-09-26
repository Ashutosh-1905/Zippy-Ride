import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

const UserLogout = () => {
    const navigate = useNavigate();
    const { logout } = useContext(UserDataContext);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const handleLogout = async () => {
            if (!token) {
                logout();
                navigate('/login');
                return;
            }

            try {
                await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error("Logout failed:", error);
            } finally {
                logout();
                navigate('/login');
            }
        };

        handleLogout();
    }, [navigate, logout, token]);

    return (
        <div className='p-6 text-center'>
            <p>Logging out...</p>
        </div>
    );
};

export default UserLogout;