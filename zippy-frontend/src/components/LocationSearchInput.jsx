import React, { useState, useEffect } from "react";
import { searchLocation } from "../api/mapApi";

const LocationSearchInput = ({ label, value, onChange }) => {
  const [input, setInput] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!input || input.length < 3) {
      setSuggestions([]);
      return;
    }
    const debounceTimeout = setTimeout(async () => {
      try {
        const results = await searchLocation(input);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      }
    }, 350);
    return () => clearTimeout(debounceTimeout);
  }, [input]);

  // When a suggestion is selected, pass its display_name (string) only
  const onSelect = (place) => {
    setInput(place.display_name);
    onChange(place.display_name); // Pass only string address
    setShowSuggestions(false);
  };

  const onInputChange = (e) => {
    setInput(e.target.value);
    onChange(e.target.value); // Also pass string on typing
    setShowSuggestions(true);
  };

  return (
    <div className="relative w-full">
      <label className="mb-1 block font-semibold">{label}</label>
      <input
        type="text"
        placeholder={`Enter ${label.toLowerCase()}...`}
        className="w-full border p-2 rounded"
        value={input}
        onChange={onInputChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 bg-white border w-full max-h-44 overflow-y-auto rounded mt-1">
          {suggestions.map((place, idx) => (
            <li
              key={idx}
              className="cursor-pointer px-3 py-2 hover:bg-gray-200"
              onMouseDown={() => onSelect(place)}
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
