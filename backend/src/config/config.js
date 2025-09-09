import { config as conf } from "dotenv";
conf();

const _config = {
    port: process.env.SERVER_PORT,
    databaseUrl: process.env.MONGODB_URI,
    env: process.env.NODE_ENV,
    frontendUrl: process.env.FRONTEND_URL,
    jwtSecret: process.env.JWT_SECRET,
    mapApi: process.env.MAP_API,
};

const config = Object.freeze(_config);

export default config;
