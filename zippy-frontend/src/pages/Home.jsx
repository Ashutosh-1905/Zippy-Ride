import React, { useContext, useState, useEffect } from "react";
import LocationSearchInput from "../components/LocationSearchInput";
import VehicleSelector from "../components/VehicleSelector";
import { getFareEstimate, requestRide } from "../api/rideApi";
import { UserDataContext } from "../context/UserContext";

const Home = () => {
  const { token, user } = useContext(UserDataContext);

  const [pickup, setPickup] = useState("");           // just string: address
  const [destination, setDestination] = useState(""); // just string: address
  const [vehicleType, setVehicleType] = useState("car");
  const [fare, setFare] = useState(null);
  const [loadingFare, setLoadingFare] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!pickup || !destination) {
      setFare(null);
      setMessage("");
      return;
    }
    const fetchFare = async () => {
      setLoadingFare(true);
      try {
        const response = await getFareEstimate(pickup, destination, token);
        setFare(response.data.fares || response.data);
        setMessage("");
      } catch (error) {
        setFare(null);
        setMessage("Failed to load fare estimate");
        console.error("Fare estimate error:", error?.response || error);
      } finally {
        setLoadingFare(false);
      }
    };
    fetchFare();
  }, [pickup, destination, token]);

  const submitRideRequest = async () => {
    if (!pickup || !destination) {
      alert("Please enter valid pickup and destination");
      return;
    }
    setMessage("");
    try {
      const payload = {
        pickup,
        destination,
        vehicleType,
      };
      console.log("Request Ride Payload:", payload);
      await requestRide(payload, token);
      setMessage("Ride requested successfully! Waiting for captain...");
    } catch (error) {
      setMessage(
        error?.response?.data?.message || "Failed to request ride. Please try again."
      );
      console.error("Ride request error:", error?.response || error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Zippy Ride</h1>
      <p className="mb-4 font-semibold">Hi {user?.fullname?.firstName || "User"}, where are you going?</p>

      <LocationSearchInput label="From" value={pickup} onChange={setPickup} />
      <div className="h-4" />
      <LocationSearchInput label="To" value={destination} onChange={setDestination} />

      <VehicleSelector selected={vehicleType} onSelect={setVehicleType} />

      <div className="mt-6">
        {loadingFare ? (
          <p>Loading fare estimate…</p>
        ) : fare && fare[vehicleType] ? (
          <p className="text-lg font-semibold">Estimated Fare: ₹{fare[vehicleType]}</p>
        ) : (
          <p className="text-gray-500">Fare estimate will appear here.</p>
        )}
      </div>

      <button
        disabled={!pickup || !destination}
        onClick={submitRideRequest}
        className="mt-6 bg-black text-white w-full py-3 rounded disabled:opacity-50"
      >
        Request Ride
      </button>

      {message && <p className="mt-4 text-center text-blue-600 font-semibold">{message}</p>}
    </div>
  );
};

export default Home;
