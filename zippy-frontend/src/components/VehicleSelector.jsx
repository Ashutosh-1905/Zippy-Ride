import React from "react";

const vehicles = [
  { type: "car", label: "Car" },
  { type: "auto", label: "Auto" },
  { type: "motorcycle", label: "Motorcycle" },
];

const VehicleSelector = ({ selected, onSelect }) => {
  return (
    <div className="flex gap-4 mt-4">
      {vehicles.map(({ type, label }) => (
        <button
          key={type}
          type="button"
          onClick={() => onSelect(type)}
          className={`px-6 py-2 rounded border font-semibold ${
            selected === type
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-gray-100"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default VehicleSelector;
