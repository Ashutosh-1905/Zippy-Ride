import axios from "axios";
import config from "../../config/config.js";
import AppError from "../../utils/AppError.js";

export const getAddressCoordinates = async (address) => {
    try {
        const response = await axios.get(config.mapApi, {
            params: {
                q: address,
                format: "json",
                limit: 1,
            },
            headers: {
                "User-Agent": "YourAppName/1.0" // required for Nominatim
            }
        });

        if (response.data.length === 0) {
            return null;
        };

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
