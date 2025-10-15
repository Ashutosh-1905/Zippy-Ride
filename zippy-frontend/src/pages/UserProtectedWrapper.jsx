import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../api/auth/userApi";
import { UserDataContext } from "../context/UserContext";

const UserProtectedWrapper = ({ children }) => {
  const { token, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setUser(null, null);
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await getUserProfile(token);
        if (res.status === 200) {
          setUser(res.data.data.user, token);
          setLoading(false);
        } else throw new Error("Unauthorized");
      } catch (error) {
        setUser(null, null);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [token, setUser, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">Loading...</div>
    );
  }
  return <>{children}</>;
};

export default UserProtectedWrapper;
