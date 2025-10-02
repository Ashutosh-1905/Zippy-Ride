import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../api/userApi";
import { UserDataContext } from "../context/UserContext";

export default function UserProtectedWrapper({ children }) {
  const { token, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setUser(null, null);
      navigate("/login");
      return;
    }

    getUserProfile(token)
      .then((res) => {
        setUser(res.data.data.user, token);
        setLoading(false);
      })
      .catch(() => {
        setUser(null, null);
        navigate("/login");
      });
  }, [token, setUser, navigate]);

  if (loading) return <div>Loading...</div>;
  return <>{children}</>;
}
