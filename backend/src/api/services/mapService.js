import axios from "axios";
import config from "../../config/config.js";
import AppError from "../../utils/AppError.js";
import Captain from "../../models/Captain.js"; 

// this is a helper function hai,
function formatDuration(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  let parts = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);

  return parts.length > 0 ? parts.join(" ") : "0 min";
}

// getAddressCoordinates function 
export const getAddressCoordinates = async (address) => {
  try {
    const response = await axios.get(config.mapApi, {
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "YourAppName/1.0", // required for Nominatim
      },
    });

    if (response.data.length === 0) {
      return null;
    }

    const location = response.data[0];

    return {
      lat: location.lat,
      lon: location.lon,
      displayName: location.display_name,
    };
  } catch (err) {
    throw new AppError("Error fetching coordinates", 500);
  }
};

// 1. Get Distance and Time Function
export const getDistanceTime = async (origin, destination) => {
  try {
    const originCoords = await getAddressCoordinates(origin);
    const destCoords = await getAddressCoordinates(destination);

    if (!originCoords || !destCoords) {
      throw new AppError("Invalid origin or destination address", 400);
    }

    const url = `http://router.project-osrm.org/route/v1/driving/${originCoords.lon},${originCoords.lat};${destCoords.lon},${destCoords.lat}?overview=false`;
    const response = await axios.get(url);

    if (!response.data?.routes || response.data.routes.length === 0) {
      throw new AppError("No route found between the locations", 404);
    }

    const route = response.data.routes[0];

    if (!route.distance || !route.duration) {
      throw new AppError("Invalid route data received", 500);
    }

    return {
      status: "OK",
      distance: { text: (route.distance / 1000).toFixed(2) + " km", value: route.distance },
      duration: { text: formatDuration(route.duration), value: route.duration },
    };
  } catch (error) {
    // If the error is already an AppError, re-throw it. Otherwise, create a new one.
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error fetching distance and time", 500);
  }
};

// 2. Auto-complete Suggestions Function
export const getAutoCompleteSuggestions = async (input) => {
  try {
    const response = await axios.get(config.mapApi, {
      params: {
        q: input,
        format: "json",
        addressdetails: 1,
        limit: 5,
      },
      headers: { "User-Agent": "YourAppName/1.0" }, // Your app's user agent
    });

    if (!response.data || response.data.length === 0) {
      return [];
    }

    const suggestions = response.data.map((place) => place.display_name);

    return suggestions;
  } catch (error) {
    throw new AppError("Error fetching suggestions", 500);
  }
};

// 3. Find Captains in a Radius Function
export const getCaptainsInTheRadius = async (lat, lng, radius) => {
  try {
    const captains = await Captain.find({
      currentLocation: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius / 6371] // Radius in radians
        },
      },
    });

    return captains;
  } catch (error) {
    throw new AppError("Error finding captains in the radius", 500);
  }
};