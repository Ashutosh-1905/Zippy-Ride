import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCaptainProfile } from "../api/captainApi";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainProtectedWrapper = ({ children }) => {
  const { token, setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setCaptain(null, null);
      navigate("/captain-login");
      return;
    }

    getCaptainProfile(token)
      .then((res) => {
        if (res.status === 200) {
          setCaptain(res.data.data.captain, token);
          setLoading(false);
        } else {
          throw new Error("Unauthorized");
        }
      })
      .catch(() => {
        setCaptain(null, null);
        navigate("/captain-login");
      });
  }, [token, setCaptain, navigate]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default CaptainProtectedWrapper;
