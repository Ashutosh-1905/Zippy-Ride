import React, { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { Link } from "react-router-dom";

const CaptainHome = () => {
  const { captain } = useContext(CaptainDataContext);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {captain?.fullname?.firstName || "Captain"}!
      </h1>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
        <p><strong>Color:</strong> {captain?.vehicle?.color || "N/A"}</p>
        <p><strong>Plate Number:</strong> {captain?.vehicle?.plate || "N/A"}</p>
        <p><strong>Capacity:</strong> {captain?.vehicle?.capacity || "N/A"}</p>
        <p><strong>Type:</strong> {captain?.vehicle?.vehicleType || "N/A"}</p>
      </div>
      <div className="mt-8 flex gap-4">
        <Link
          to="/captain-logout"
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </Link>
        {/* You can add more buttons/links as needed */}
      </div>
    </div>
  );
}

export default CaptainHome;
