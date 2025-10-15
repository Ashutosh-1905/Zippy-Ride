import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginCaptain } from "../api/auth/captainApi.js";
import { CaptainDataContext } from "../context/CaptainContext.jsx";

const CaptainLogin = () => {
  const { setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginCaptain({ email, password });
      const { captain, token } = res.data; // backend should respond with these keys
      if (!token || !captain) throw new Error("Invalid response from server");

      setCaptain(captain, token);
      navigate("/captain-home");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Captain Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          required
        />

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <button type="submit" className="bg-black text-white py-2 rounded w-full hover:bg-gray-900">
          Login
        </button>
      </form>
    </div>
  );
};

export default CaptainLogin;
