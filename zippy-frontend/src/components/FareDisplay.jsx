import React from "react";

// FareDisplay shows estimated fare info with loading and error handling
const FareDisplay = ({ fare, vehicleType, loading }) => {
  if (loading) {
    return <p className="text-gray-600 italic">Calculating fare...</p>;
  }

  if (!fare) {
    return <p className="text-gray-500">Fare will be shown here</p>;
  }

  const fareAmount = fare[vehicleType];

  if (fareAmount === undefined) {
    return <p className="text-red-600">Fare info not available for selected vehicle</p>;
  }

  return (
    <p className="text-lg font-semibold">
      Estimated Fare: <span className="text-green-700">₹{fareAmount}</span>
    </p>
  );
};

export default React.memo(FareDisplay);
