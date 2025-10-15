import React, { useState, useContext } from "react";
import { registerCaptain } from "../api/auth/captainApi";
import { useNavigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";

const DEFAULT_LOCATION = {
  type: "Point",
  coordinates: [77.4126, 23.2599], // Bhopal [lng, lat] fallback
};

const CaptainSignup = () => {
  const { setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: { firstName: "", lastName: "" },
    email: "",
    password: "",
    vehicle: { color: "", plate: "", capacity: 2, vehicleType: "car" },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Nested state for fullname/vehicle
    if (name.startsWith("fullname.")) {
      setFormData((prev) => ({
        ...prev,
        fullname: { ...prev.fullname, [name.split(".")[1]]: value },
      }));
    } else if (name.startsWith("vehicle.")) {
      setFormData((prev) => ({
        ...prev,
        vehicle: { ...prev.vehicle, [name.split(".")[1]]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Try to get geolocation, fallback if blocked/error
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const location = {
            type: "Point",
            coordinates: [pos.coords.longitude, pos.coords.latitude],
          };
          finishRegistration(location);
        },
        () => {
          finishRegistration(DEFAULT_LOCATION);
        }
      );
    } else {
      // If geolocation not supported, fallback
      finishRegistration(DEFAULT_LOCATION);
    }
  };

  // Register API call
  const finishRegistration = async (location) => {
    try {
      const res = await registerCaptain({
        ...formData,
        currentLocation: location,
      });
      // Save to context/localStorage
      setCaptain(res.data.captain, res.data.token);
      navigate("/captain-home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Captain Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="fullname.firstName"
            value={formData.fullname.firstName}
            onChange={handleChange}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="fullname.lastName"
            value={formData.fullname.lastName}
            onChange={handleChange}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            className="border rounded p-2 w-full"
          />
        </div>
        {/* Vehicle details */}
        <div>
          <label>Vehicle Color</label>
          <input
            type="text"
            name="vehicle.color"
            value={formData.vehicle.color}
            onChange={handleChange}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label>Vehicle Plate</label>
          <input
            type="text"
            name="vehicle.plate"
            value={formData.vehicle.plate}
            onChange={handleChange}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label>Vehicle Capacity</label>
          <input
            type="number"
            name="vehicle.capacity"
            value={formData.vehicle.capacity}
            onChange={handleChange}
            required
            className="border rounded p-2 w-full"
          />
        </div>
        <div>
          <label>Vehicle Type</label>
          <select
            name="vehicle.vehicleType"
            value={formData.vehicle.vehicleType}
            onChange={handleChange}
            required
            className="border rounded p-2 w-full"
          >
            <option value="car">Car</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 mt-2 rounded"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default CaptainSignup;
