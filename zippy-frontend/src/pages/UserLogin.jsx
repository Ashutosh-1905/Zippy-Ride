import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth/userApi";
import { UserDataContext } from "../context/UserContext";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginUser({ email, password });
      const { user, token } = res.data;
      setUser(user, token);
      navigate("/home");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="p-6 rounded bg-white w-80 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">User Login</h2>
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
        <button type="submit" className="w-full py-2 bg-black text-white rounded">Login</button>
        <p className="mt-3 text-sm">
          New user? <Link to="/signup" className="text-blue-600">Sign up here</Link>
        </p>
        <div className="mt-3">
          <Link to="/captain-login" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded block text-center">
            Sign in as Captain
          </Link>
        </div>
      </form>
    </div>
  );
};

export default UserLogin;
