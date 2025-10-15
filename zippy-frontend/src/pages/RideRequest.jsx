import React, { useState, useEffect, useContext } from "react";
import LocationSearchInput from "../components/LocationSearchInput";
import VehicleSelector from "../components/VehicleSelector";
import { getFareEstimate, requestRide } from "../api/rides/rideApi";
import { UserDataContext } from "../context/UserContext";
import { useSocket } from "../context/SocketContext";
import Loader from "../components/Loader";
import Notification from "../components/Notification";
import FareDisplay from "../components/FareDisplay";
import RideStatus from "../components/RideStatus";

const RideRequest = () => {
  const { token } = useContext(UserDataContext);
  const { socket } = useSocket();

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("car");
  const [fare, setFare] = useState(null);
  const [loadingFare, setLoadingFare] = useState(false);

  // Ride metadata and status
  const [ride, setRide] = useState(null);
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState(""); // ride status: requested, accepted, started
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  useEffect(() => {
    if (!pickup || !destination) {
      setFare(null);
      return;
    }

    setLoadingFare(true);
    setMessage("");

    const fetchFare = async () => {
      try {
        const res = await getFareEstimate(pickup, destination, token);
        setFare(res.data.fares || res.data);
      } catch {
        setFare(null);
        setMessageType("error");
        setMessage("Error loading fare estimate");
      } finally {
        setLoadingFare(false);
      }
    };
    fetchFare();
  }, [pickup, destination, token]);

  useEffect(() => {
    if (!socket) return;

    const handleAccepted = (r) => {
      setRide(r);
      setStatus("accepted");
      setOtp(r.otp);
      setMessageType("success");
      setMessage("Captain accepted your ride! Please show OTP to your captain.");
    };

    const handleStarted = (r) => {
      setRide(r);
      setStatus("started");
      setOtp("");
      setMessageType("info");
      setMessage("Your ride has started!");
    };

    socket.on("ride-accepted", handleAccepted);
    socket.on("ride-started", handleStarted);

    return () => {
      socket.off("ride-accepted", handleAccepted);
      socket.off("ride-started", handleStarted);
    };
  }, [socket]);

  const submitRideRequest = async () => {
    setMessage("");
    setMessageType("info");
    setOtp("");
    setStatus("");

    if (!pickup.trim() || !destination.trim()) {
      setMessageType("error");
      setMessage("Pickup and destination locations are required");
      return;
    }

    try {
      const res = await requestRide({ pickup, destination, vehicleType }, token);
      setRide(res.data.ride);
      setOtp(res.data.ride.otp);
      setStatus("requested");
      setMessageType("success");
      setMessage("Ride requested! Share OTP with your captain when they arrive.");
    } catch {
      setMessageType("error");
      setMessage("Failed to request ride, please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-8">
      <h2 className="text-2xl font-bold mb-2">Zippy Ride</h2>

      <LocationSearchInput label="Pickup Location" value={pickup} onChange={setPickup} />
      <div className="my-5"></div>
      <LocationSearchInput label="Destination" value={destination} onChange={setDestination} />
      <VehicleSelector selected={vehicleType} onSelect={setVehicleType} />

      <div className="mt-5">
        {loadingFare ? (
          <Loader text="Loading fare estimate..." />
        ) : (
          <FareDisplay fare={fare} vehicleType={vehicleType} loading={loadingFare} />
        )}
      </div>

      <button
        className="mt-6 bg-black text-white w-full py-3 rounded disabled:opacity-50"
        disabled={!pickup || !destination}
        onClick={submitRideRequest}
      >
        Request Ride
      </button>

      <RideStatus status={status} otp={otp} />

      {message && <Notification type={messageType} message={message} />}
    </div>
  );
};

export default RideRequest;
