import axios from "axios";
import config from "../../config/config.js";
import AppError from "../../utils/AppError.js";
import Captain from "../../models/Captain.js";


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


export const getAddressCoordinates = async (address) => {
  try {
    const response = await axios.get(config.mapApi, {
      params: {
        q: address,
        format: "json",
        limit: 1,
        "accept-language": "en",
      },
      headers: {
        "User-Agent": "YourAppName/1.0",
      },
    });

    if (response.data.length === 0) {
      console.log("Geocoding failed for:", address);
      return null;
    }

    const location = response.data[0];
    console.log("Geocoding result for", address, "is", location.lat, location.lon);

    return {
      lat: parseFloat(location.lat),
      lon: parseFloat(location.lon),
      displayName: location.display_name,
    };
  } catch (err) {
    if (err.response) {
      console.error("Nominatim API Error:", err.response.status, err.response.data);
    } else if (err.request) {
      console.error("Nominatim API Error: No response received");
    } else {
      console.error("Nominatim API Error:", err.message);
    }
    throw new AppError("Error fetching coordinates from map API", 500);
  }
};


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
      distance: {
        text: (route.distance / 1000).toFixed(2) + " km",
        value: route.distance,
      },
      duration: {
        text: formatDuration(route.duration),
        value: route.duration,
      },
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error("Error fetching distance and time:", error);
    throw new AppError("Error fetching distance and time", 500);
  }
};


export const getAutoCompleteSuggestions = async (input) => {
  try {
    const response = await axios.get(config.mapApi, {
      params: {
        q: input,
        format: "json",
        addressdetails: 1,
        limit: 5,
        "accept-language": "en",
      },
      headers: { "User-Agent": "YourAppName/1.0" },
    });

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map((place) => {
      const address = place.address || {};
      return {
        city: address.city || address.town || address.village || "",
        state: address.state || "",
        country: address.country || "",
        lat: place.lat,
        lon: place.lon,
        displayName: place.display_name,
      };
    });
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    throw new AppError("Error fetching suggestions", 500);
  }
};

/**
 * IMPORTANT: Fix parameter order here to lng, lat, radius 
 * as MongoDB expects [lng, lat] for $centerSphere.
 */
export const getCaptainsInTheRadius = async (lng, lat, radius) => {
  try {
    const captains = await Captain.find({
      currentLocation: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius / 6378.1],
        },
      },
      status: "active",
      socketId: { $exists: true, $ne: null },
    });
    return captains;
  } catch (error) {
    console.error("Error finding captains in radius:", error);
    throw new AppError("Error finding captains in the radius", 500);
  }
};
