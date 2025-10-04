import React, { useEffect, useState, useContext, useCallback } from "react";
import { useSocket } from "../context/SocketContext.jsx";
import { CaptainDataContext } from "../context/CaptainContext.jsx";
import axios from "axios";

const SOCKET_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const LS_PENDING_KEY = "pendingRides";
const LS_ACCEPTED_KEY = "acceptedRide";

const CaptainHome = () => {
  const { captain, token } = useContext(CaptainDataContext);
  const { socket } = useSocket();

  const captainId = captain?._id || captain?.id;

  const [pendingRides, setPendingRides] = useState(() => {
    const stored = localStorage.getItem(LS_PENDING_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [acceptedRide, setAcceptedRide] = useState(() => {
    const stored = localStorage.getItem(LS_ACCEPTED_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    localStorage.setItem(LS_PENDING_KEY, JSON.stringify(pendingRides));
  }, [pendingRides]);

  useEffect(() => {
    if (acceptedRide) {
      localStorage.setItem(LS_ACCEPTED_KEY, JSON.stringify(acceptedRide));
    } else {
      localStorage.removeItem(LS_ACCEPTED_KEY);
    }
  }, [acceptedRide]);

  const handleNewRide = useCallback(
    (ride) => {
      setPendingRides((prev) => (prev.some((r) => r._id === ride._id) ? prev : [...prev, ride]));
    },
    [setPendingRides]
  );

  useEffect(() => {
    if (!socket || !captainId || !token) return;

    socket.emit("join", { userId: captainId, userType: "captain" });
    console.log(`Captain ${captainId} joined socket`);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          socket.emit("updateLocation", {
            userId: captainId,
            userType: "captain",
            location: {
              type: "Point",
              coordinates: [pos.coords.longitude, pos.coords.latitude],
            },
          });
          console.log("Sent current location via socket");
        },
        (err) => console.error("Geolocation error:", err)
      );
    }

    socket.on("new-ride-request", handleNewRide);

    return () => {
      socket.off("new-ride-request", handleNewRide);
    };
  }, [socket, captainId, token, handleNewRide]);

  const acceptRide = async (rideId) => {
    try {
      await axios.post(
        `${SOCKET_URL}/api/v1/rides/accept-ride`,
        { rideId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const ride = pendingRides.find((r) => r._id === rideId);
      setAcceptedRide(ride);
      setPendingRides((prev) => prev.filter((r) => r._id !== rideId));
      alert("Ride accepted! Start your trip.");
    } catch (error) {
      alert(error.response?.data?.message || "Could not accept ride.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Welcome {captain?.fullname?.firstName || "Captain"}</h1>

      {acceptedRide ? (
        <div className="p-4 border rounded shadow bg-green-50">
          <h2 className="text-xl font-semibold mb-2">Current Ride</h2>
          <p><strong>Pickup:</strong> {acceptedRide.pickup}</p>
          <p><strong>Destination:</strong> {acceptedRide.destination}</p>
          <p><strong>Vehicle:</strong> {acceptedRide.vehicleType}</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold">Incoming Ride Requests</h2>
          {pendingRides.length === 0 ? (
            <p className="text-gray-500">No new rides yet.</p>
          ) : (
            pendingRides.map((ride) => (
              <div key={ride._id} className="p-4 border rounded mb-3 shadow bg-white">
                <p><strong>Pickup:</strong> {ride.pickup}</p>
                <p><strong>Destination:</strong> {ride.destination}</p>
                <p><strong>Vehicle:</strong> {ride.vehicleType}</p>
                <button
                  onClick={() => acceptRide(ride._id)}
                  className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Accept Ride
                </button>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default CaptainHome;
