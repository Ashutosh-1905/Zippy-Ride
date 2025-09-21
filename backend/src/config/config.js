import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.SERVER_PORT || process.env.PORT || 4000,
  databaseUrl: process.env.MONGODB_URI,
  env: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL,
  jwtSecret: process.env.JWT_SECRET || "change_this_secret",
  mapApi: process.env.MAP_API,
};

const config = Object.freeze(_config);

export default config;
