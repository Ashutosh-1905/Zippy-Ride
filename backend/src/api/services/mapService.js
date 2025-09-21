import axios from "axios";
import config from "../../config/config.js";
import AppError from "../../utils/AppError.js";
import Captain from "../../models/Captain.js";

// this is a helper function,
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
                "User-Agent": "YourAppName/1.0",
            },
        });

        if (response.data.length === 0) {
            return null;
        }

        const location = response.data[0];

        return {
            lat: parseFloat(location.lat),
            lon: parseFloat(location.lon), 
            displayName: location.display_name,
        };
    } catch (err) {
        if (err.response) {
            console.error("Nominatim API Error:", err.response.status, err.response.data);
        } else if (err.request) {
            console.error("Nominatim API Error: No response received. Check network connectivity.");
        } else {
            console.error("Nominatim API Error:", err.message);
        }
        throw new AppError("Error fetching coordinates", 500);
    }
};

// Get Distance and Time Function
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
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Error fetching distance and time", 500);
    }
};

// Auto-complete Suggestions Function
export const getAutoCompleteSuggestions = async (input) => {
    try {
        const response = await axios.get(config.mapApi, {
            params: {
                q: input,
                format: "json",
                addressdetails: 1,
                limit: 5,
            },
            headers: { "User-Agent": "YourAppName/1.0" },
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

// Find Captains in a Radius Function
// export const getCaptainsInTheRadius = async (lat, lng, radius) => {
//     try {
//         const captains = await Captain.find({
//             "currentLocation.lat": {
//                 $gte: lat - (radius / 111.32), // approx km per degree lat
//                 $lte: lat + (radius / 111.32)
//             },
//             "currentLocation.lng": {
//                 $gte: lng - (radius / (111.32 * Math.cos(lat * Math.PI / 180))), // approx km per degree lng
//                 $lte: lng + (radius / (111.32 * Math.cos(lat * Math.PI / 180)))
//             },
//         });
//         return captains;
//     } catch (error) {
//         throw new AppError("Error finding captains in the radius", 500);
//     }
// };

// src/api/services/mapService.js
// ...
export const getCaptainsInTheRadius = async (lat, lng, radius) => {
  try {
    const captains = await Captain.find({
      currentLocation: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius / 6378.1] // radius in radians
        }
      }
    });
    return captains;
  } catch (error) {
    throw new AppError("Error finding captains in the radius", 500);
  }
};