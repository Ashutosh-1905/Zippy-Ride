import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/userApi";
import { UserDataContext } from "../context/UserContext";

export default function UserLogout() {
  const { token, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setUser(null, null);
      navigate("/login");
      return;
    }
    logoutUser(token)
      .finally(() => {
        setUser(null, null);
        navigate("/login");
      });
  }, [token, setUser, navigate]);

  return <div className="h-screen flex items-center justify-center">Logging out...</div>;
}
