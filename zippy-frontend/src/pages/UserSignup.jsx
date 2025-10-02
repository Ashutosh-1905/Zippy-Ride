import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/userApi";
import { UserDataContext } from "../context/UserContext";

const UserSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const newUser = {
        fullname: { firstName, lastName },
        email,
        password,
      };
      const res = await registerUser(newUser);
      const { user, token } = res.data;
      setUser(user, token);
      navigate("/home");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.map(e => e.msg).join(", ") ||
          "Signup failed"
      );
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">User Signup</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
          required
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button type="submit" className="w-full py-2 bg-black text-white rounded">Sign Up</button>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login" className="text-blue-600">Login here</Link>
        </p>
        <div className="mt-3">
          <Link to="/captain-signup" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded block text-center">
            Sign up as Captain
          </Link>
        </div>
      </form>
    </div>
  );
};

export default UserSignup;
