import { config as conf } from "dotenv";
conf();
import http from "http";

import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDb from "./src/config/connectDb.js";

import { initializeSocket } from "./src/utils/socket.js";

const PORT = config.port || 4000;
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

const startServer = async () => {
  try {
    await connectDb();
    server.listen(PORT, () => {
      console.log(`server is running on port: ${PORT}`);
    });
  } catch (err) {
    console.log("Failed to start server: ", err);
  }
};

startServer();
