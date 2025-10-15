import React from "react";

const RideStatus = ({ status, otp }) => {
  if (!status) return null;

  switch (status) {
    case "requested":
      return (
        <div className="mt-6 bg-yellow-50 border border-yellow-300 px-3 py-3 rounded">
          <p className="font-semibold mb-1 text-yellow-900">
            Your ride OTP: <span className="text-xl">{otp}</span>
          </p>
          <p className="text-sm text-yellow-700">
            Share this OTP with your captain <strong>only when they arrive</strong>.
          </p>
        </div>
      );

    case "accepted":
      return (
        <div className="mt-6 bg-blue-50 border border-blue-300 px-3 py-3 rounded">
          <p className="font-semibold mb-1 text-blue-900">
            Captain has accepted your ride! Please provide the OTP above.
          </p>
        </div>
      );

    case "started":
      return (
        <div className="mt-6 bg-green-50 border border-green-300 px-3 py-3 rounded">
          <p className="text-xl font-bold text-green-900">Your ride has started!</p>
        </div>
      );

    default:
      return null;
  }
};

export default React.memo(RideStatus);
