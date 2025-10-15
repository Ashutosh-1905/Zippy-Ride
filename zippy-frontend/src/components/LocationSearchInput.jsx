import React, { useState, useEffect } from "react";
import { searchLocation } from "../api/mapApi";
import useDebouncedValue from "../hooks/useDebouncedValue";

/**
 * LocationSearchInput component optimizes location search by debouncing user input.
 * It waits for user to stop typing for 400ms before firing API call to reduce server load.
 */
const LocationSearchInput = ({ label, value, onChange }) => {
  const [input, setInput] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // debounce input value for 400ms to prevent API flooding on every key stroke
  const debouncedValue = useDebouncedValue(input, 400);

  useEffect(() => {
    // fetch location suggestions only when input length >= 3
    const fetchSuggestions = async () => {
      if (!debouncedValue || debouncedValue.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const results = await searchLocation(debouncedValue);
        setSuggestions(results);
      } catch (error) {
        setSuggestions([]); // suppress errors gracefully for UX
      }
    };
    fetchSuggestions();
  }, [debouncedValue]);

  // User selects a suggested location - format the display string properly
  const onSelect = (place) => {
    const { address, display_name } = place;
    const formattedAddress =
      address && (address.city || address.town || address.village)
        ? `${address.city || address.town || address.village}, ${address.state || ""}, ${address.country || ""}`.replace(/,\s*$/, "") // trim trailing comma
        : display_name;

    setInput(formattedAddress);
    onChange(formattedAddress);
    setShowSuggestions(false);
  };

  // Handle input change, update local input state, propagate to parent onChange, show suggestions
  const handleInputChange = (e) => {
    setInput(e.target.value);
    onChange(e.target.value);
    setShowSuggestions(true);
  };

  return (
    <div className="relative w-full">
      <label className="mb-1 block font-semibold">{label}</label>
      <input
        type="text"
        autoComplete="off"
        placeholder={`Enter ${label.toLowerCase()}...`}
        className="w-full border p-2 rounded"
        value={input}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // delay to allow click on suggestion
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 bg-white border w-full max-h-44 overflow-y-auto rounded mt-1 shadow">
          {suggestions.map((place, idx) => (
            <li
              key={idx}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100"
              onMouseDown={() => onSelect(place)} // use onMouseDown to avoid blur issue
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearchInput;
