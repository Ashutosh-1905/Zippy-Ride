import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerCaptain } from "../api/captainApi";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [error, setError] = useState("");

  const { setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleColor || !vehiclePlate || !vehicleCapacity || !vehicleType) {
      setError("Please fill all vehicle details");
      return;
    }

    setError("");

    try {
      const payload = {
        fullname: { firstName, lastName },
        email,
        password,
        vehicle: {
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: Number(vehicleCapacity),
          vehicleType,
        },
      };

      const res = await registerCaptain(payload);
      const { captain, token } = res.data;
      setCaptain(captain, token);
      navigate("/captain-home");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.map(e => e.msg).join(", ") ||
          "Sign up failed"
      );
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Captain Signup</h2>

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

        <h3 className="font-semibold mt-4 mb-2">Vehicle Details</h3>

        <input
          type="text"
          placeholder="Color"
          value={vehicleColor}
          onChange={e => setVehicleColor(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Plate Number"
          value={vehiclePlate}
          onChange={e => setVehiclePlate(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
          required
        />
        <input
          type="number"
          placeholder="Capacity"
          value={vehicleCapacity}
          onChange={e => setVehicleCapacity(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
          min={1}
          required
        />
        <select
          value={vehicleType}
          onChange={e => setVehicleType(e.target.value)}
          className="mb-2 p-2 border rounded w-full"
          required
        >
          <option value="">Select Vehicle Type</option>
          <option value="car">Car</option>
          <option value="motorcycle">Motorcycle</option>
          <option value="auto">Auto</option>
        </select>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <button type="submit" className="w-full py-2 bg-black text-white rounded">
          Create Account
        </button>
        <p className="mt-3 text-center">
          Already registered? <Link to="/captain-login" className="text-blue-600">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default CaptainSignup;
