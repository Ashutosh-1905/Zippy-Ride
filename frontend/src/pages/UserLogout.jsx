import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router';

const UserLogout = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    axios.get(`${import.meta.env.VITE_API_URL}/users/logout`,{
        headers:{
            Authorization: `Bearer ${token}`
        }
    }).then((response)=>{
        if(response.status === 200){
            localStorage.removeItem("token");
            navigate("/login")
        }
    });

  return (
    <div>
      User Logout
    </div>
  )
}

export default UserLogout
