import React, { useState, useEffect, useContext } from "react";
import LocationSearchInput from "../components/LocationSearchInput";
import VehicleSelector from "../components/VehicleSelector";
import { getFareEstimate, requestRide } from "../api/rideApi";
import { UserDataContext } from "../context/UserContext";
import { useSocket } from "../context/SocketContext";

const RideRequest = () => {
  const { token } = useContext(UserDataContext);
  const { socket } = useSocket();

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("car");
  const [fare, setFare] = useState(null);
  const [loadingFare, setLoadingFare] = useState(false);

  // -- Ride metadata --
  const [ride, setRide] = useState(null);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState(""); // "requested" | "accepted" | "started"
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!pickup || !destination) {
      setFare(null);
      return;
    }
    const fetchFare = async () => {
      setLoadingFare(true);
      try {
        const res = await getFareEstimate(pickup, destination, token);
        setFare(res.data.fares || res.data);
      } catch {
        setFare(null);
        setMessage("Error loading fare");
      } finally {
        setLoadingFare(false);
      }
    };
    fetchFare();
  }, [pickup, destination, token]);

  // 1️⃣ Listen for ride-accepted and ride-started event from backend/captain
  useEffect(() => {
    if (!socket) return;

    const handleAccepted = r => {
      setRide(r); // update ride object
      setStatus("accepted");
      setOtp(r.otp); // still show OTP
      setMessage("Captain accepted your ride! Please give the OTP below to your captain.");
    };

    const handleStarted = r => {
      setRide(r);
      setStatus("started");
      setOtp(""); // clear OTP for privacy
      setMessage("Your ride has started!");
    };

    socket.on("ride-accepted", handleAccepted);
    socket.on("ride-started", handleStarted);

    return () => {
      socket.off("ride-accepted", handleAccepted);
      socket.off("ride-started", handleStarted);
    };
  }, [socket]);

  // 2️⃣ When user submits ride, save OTP and status
  const submitRideRequest = async () => {
    setMessage("");
    setOtp("");
    setStatus("");
    try {
      const res = await requestRide({ pickup, destination, vehicleType }, token);
      setRide(res.data.ride);
      setOtp(res.data.ride.otp); // immediate backend OTP
      setStatus("requested");
      setMessage("Ride requested! Give this OTP to your captain when they arrive.");
    } catch {
      setMessage("Failed to request ride, please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-8">
      <h2 className="text-2xl font-bold mb-2">Zippy Ride</h2>

      <LocationSearchInput label="Pickup Location" value={pickup} onChange={setPickup} />
      <div className="my-5" />
      <LocationSearchInput label="Destination" value={destination} onChange={setDestination} />
      <VehicleSelector selected={vehicleType} onSelect={setVehicleType} />

      <div className="mt-5">
        {loadingFare ? (
          <p>Loading fare estimate...</p>
        ) : fare && fare[vehicleType] !== undefined ? (
          <p className="text-lg font-semibold">Estimated Fare: ₹{fare[vehicleType]}</p>
        ) : (
          <p className="text-gray-500">Fare will be shown here</p>
        )}
      </div>

      <button
        className="mt-6 bg-black text-white w-full py-3 rounded disabled:opacity-50"
        disabled={!pickup || !destination}
        onClick={submitRideRequest}
      >
        Request Ride
      </button>

      {/* -- OTP and status box -- */}
      {otp && (status === "requested" || status === "accepted") && (
        <div className="mt-6 bg-yellow-50 border border-yellow-300 px-3 py-3 rounded">
          <p className="font-semibold mb-1 text-yellow-900">
            Your ride OTP: <span className="text-xl">{otp}</span>
          </p>
          <p className="text-sm text-yellow-700">
            Share this OTP with your captain <strong>only when they arrive</strong>.
          </p>
        </div>
      )}

      {/* Ride accepted (blue status shown above, still shows OTP) */}
      {status === "accepted" && (
        <div className="mt-6 bg-blue-50 border border-blue-300 px-3 py-3 rounded">
          <p className="font-semibold mb-1 text-blue-900">
            Captain has accepted your ride! Please provide the OTP above.
          </p>
        </div>
      )}

      {/* Ride started clear status -- no OTP */}
      {status === "started" && (
        <div className="mt-6 bg-green-50 border border-green-300 px-3 py-3 rounded">
          <p className="text-xl font-bold text-green-900">Your ride has started!</p>
        </div>
      )}

      {/* Any other general messages */}
      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </div>
  );
};

export default RideRequest;
