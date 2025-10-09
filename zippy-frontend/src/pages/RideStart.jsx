import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext.jsx";

const RideStart = () => {
  const { token } = useContext(CaptainDataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const ride = location.state?.ride;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  if (!ride) return <p>No ride info found.</p>;

  // const startRide = async () => {
  //   if (otp.length !== 6) {
  //     setError("OTP must be 6 digits.");
  //     return;
  //   }
  //   setError("");
  //   try {
  //     await axios.post(
  //       `${import.meta.env.VITE_BASE_URL}/api/v1/rides/start-ride`,
  //       { rideId: ride._id, otp },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     alert("Ride started successfully!");
  //     navigate("/captain-home");
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Failed to start ride");
  //   }
  // };

const startRide = async () => {
  if (otp.trim().length !== 6) {
    setError("OTP must be 6 digits.");
    return;
  }
  setError("");
  try {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/v1/rides/start-ride`,
      { rideId: ride._id, otp: otp.trim() }, // Always send trimmed!
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Ride started successfully!");
    navigate("/captain-home");
  } catch (err) {
    setError(err.response?.data?.message || "Failed to start ride");
  }
};


  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Start Ride</h2>
      <p><strong>Pickup:</strong> {ride.pickup}</p>
      <p><strong>Destination:</strong> {ride.destination}</p>

      <input
        type="text"
        maxLength={6}
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2 rounded w-full my-4"
      />

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button
        onClick={startRide}
        disabled={otp.length !== 6}
        className="w-full py-3 bg-black text-white rounded disabled:opacity-50"
      >
        Start Ride
      </button>
    </div>
  );
};

export default RideStart;
