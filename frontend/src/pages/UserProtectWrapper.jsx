import React, { useEffect } from 'react';

import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router';

const UserProtectWrapper = ({children}) => {

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(()=>{
        if(!token){
            navigate("/login")
        }
    }, [token])
  return (
    <div>
      {children}
    </div>
  )
}

export default UserProtectWrapper
