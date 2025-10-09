import { Server } from "socket.io";
import User from "../models/User.js";
import Captain from "../models/Captain.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async ({ userId, userType }) => {
      try {
        if (!userId || !userType) {
          return console.log("Join event missing userId or userType");
        }
        if (userType === "user") {
          await User.findByIdAndUpdate(userId, { socketId: socket.id });
          console.log(`User ${userId} joined with socketId ${socket.id}`);
        } else if (userType === "captain") {
          await Captain.findByIdAndUpdate(userId, {
            socketId: socket.id,
            status: "active",
          });
          console.log(`Captain ${userId} joined with socketId ${socket.id}`);
        }
      } catch (err) {
        console.error("Error in join event:", err);
      }
    });

    socket.on("updateLocation", async ({ userId, userType, location }) => {
      try {
        if (
          location &&
          location.type === "Point" &&
          Array.isArray(location.coordinates) &&
          location.coordinates.length === 2
        ) {
          if (userType === "user") {
            await User.findByIdAndUpdate(userId, { currentLocation: location });
          } else if (userType === "captain") {
            await Captain.findByIdAndUpdate(userId, {
              currentLocation: location,
            });
          }
        } else {
          console.log("Invalid location format in updateLocation", location);
        }
      } catch (err) {
        console.error("Error in updateLocation:", err);
      }
    });

    socket.on("disconnect", async () => {
      console.log(`Client disconnected: ${socket.id}`);
      try {
        await User.updateOne({ socketId: socket.id }, { $unset: { socketId: "" } });
        await Captain.updateOne(
          { socketId: socket.id },
          { $unset: { socketId: "" }, status: "inactive" }
        );
      } catch (err) {
        console.error("Error clearing socketId on disconnect:", err);
      }
    });
  });
};

export const sendMessageToSocketId = (socketId, messageObject) => {
  if (!io) {
    console.log("Socket.io not initialized");
    return;
  }
  if (!socketId) {
    console.log("sendMessageToSocketId called with empty socketId");
    return;
  }
  io.to(socketId).emit(messageObject.event, messageObject.data);
  console.log(`Sent event '${messageObject.event}' to socket: ${socketId}`);
};
