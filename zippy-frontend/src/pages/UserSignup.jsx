import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/userApi";
import { UserDataContext } from "../context/UserContext";

export default function UserSignup() {
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
        fullname: {
          firstName,
          lastName,
        },
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
          err?.response?.data?.errors?.map((e) => e.msg).join(", ") ||
          "Signup failed"
      );
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="p-6 rounded bg-white w-80 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Sign Up</h2>

        <input
          type="text"
          placeholder="First Name"
          className="mb-2 p-2 border rounded w-full"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="mb-2 p-2 border rounded w-full"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="mb-2 p-2 border rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-2 p-2 border rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button className="w-full py-2 bg-black text-white rounded" type="submit">Sign Up</button>
        <p className="mt-3 text-sm">
          Already have an account? <Link className="text-blue-600" to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}
