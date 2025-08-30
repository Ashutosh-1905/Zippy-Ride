import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserLogout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } catch (err) {
        console.error('Logout failed:', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    logoutUser();
  }, [navigate, token]);

  return <div>Logging out...</div>;
};

export default UserLogout;
