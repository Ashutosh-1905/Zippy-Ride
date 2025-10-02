import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginCaptain } from "../api/captainApi";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginCaptain({ email, password });
      const { captain, token } = res.data;
      setCaptain(captain, token);
      navigate("/captain-home");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="p-6 rounded bg-white w-80 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Captain Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-3 p-2 border rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-3 p-2 border rounded w-full"
          required
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button className="w-full py-2 bg-black text-white rounded" type="submit">Login</button>
        <p className="mt-3 text-sm">
          New here? <Link to="/captain-signup" className="text-blue-600">Sign up here</Link>
        </p>
        <p className="mt-2 text-sm">
          Are you a user? <Link to="/login" className="text-blue-600">Login as User</Link>
        </p>
      </form>
    </div>
  );
};

export default CaptainLogin;
