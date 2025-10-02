import React, { useState, useEffect, useContext } from "react";
import LocationSearchInput from "../components/LocationSearchInput";
import VehicleSelector from "../components/VehicleSelector";
import { getFareEstimate, requestRide } from "../api/rideApi";
import { UserDataContext } from "../context/UserContext";

const RideRequest = () => {
  const { token } = useContext(UserDataContext);

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("car");
  const [fare, setFare] = useState(null);
  const [loadingFare, setLoadingFare] = useState(false);
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

  const submitRideRequest = async () => {
    if (!pickup || !destination) {
      alert("Please fill both pickup and destination");
      return;
    }
    try {
      await requestRide({ pickup, destination, vehicleType }, token);
      setMessage("Ride requested successfully. Waiting for a captain.");
    } catch {
      setMessage("Failed to request ride, please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-8">
      <h2 className="text-2xl font-bold mb-5">Request a Ride</h2>

      <LocationSearchInput label="Pickup Location" value={pickup} onChange={setPickup} />
      <div className="my-5" />
      <LocationSearchInput label="Destination" value={destination} onChange={setDestination} />

      <VehicleSelector selected={vehicleType} onSelect={setVehicleType} />

      <div className="mt-5">
        {loadingFare ? (
          <p>Loading fare estimate...</p>
        ) : fare && fare[vehicleType] !== undefined ? (
          <p className="text-lg font-semibold">Estimated fare: ₹{fare[vehicleType]}</p>
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

      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </div>
  );
};

export default RideRequest;
