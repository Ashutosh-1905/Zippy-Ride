import axios from "axios";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

export const searchLocation = async (query) => {
  const params = new URLSearchParams({
    format: "json",
    q: query,
    addressdetails: 1,
    limit: 5,
    "accept-language": "en", // always use English
  });

  const response = await axios.get(`${NOMINATIM_BASE_URL}?${params}`);
  return response.data;
};
