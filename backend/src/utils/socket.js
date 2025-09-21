import { Server } from "socket.io";
import User from "../models/User.js";
import Captain from "../models/Captain.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;
      try {
        if (userType === "user") {
          await User.findByIdAndUpdate(userId, { socketId: socket.id });
          console.log(`User ${userId} joined with socket ID: ${socket.id}`);
        } else if (userType === "captain") {
          await Captain.findByIdAndUpdate(userId, { socketId: socket.id });
          console.log(`Captain ${userId} joined with socket ID: ${socket.id}`);
        }
      } catch (error) {
        console.error("Error joining socket:", error);
      }
    });

    // socket.on("update-location-captain", async (data) => {
    //   const { userId, location } = data;
    //   if (location && typeof location.lat === "number" && typeof location.lng === "number") {
    //     try {
    //       await Captain.findByIdAndUpdate(userId, {
    //         currentLocation: {
    //           type: "Point",
    //           coordinates: [location.lng, location.lat], // GeoJSON expects [lng, lat]
    //         },
    //       });
    //     } catch (error) {
    //       console.error("Error updating captain location:", error);
    //     }
    //   } else {
    //     socket.emit("error", { message: "Invalid location data" });
    //   }
    // });

    socket.on("updateLocation", async ({ userId, userType, location }) => {
  try {
    if (userType === "user") {
      await User.findByIdAndUpdate(userId, {
        currentLocation: {
          type: "Point",
          coordinates: [location.lng, location.lat],
        },
      });
    } else if (userType === "captain") {
      await Captain.findByIdAndUpdate(userId, {
        currentLocation: {
          type: "Point",
          coordinates: [location.lng, location.lat],
        },
      });
    }
  } catch (error) {
    console.error("Error updating location:", error);
  }
});

    // socket.on("disconnect", async () => {
    //   console.log(`Client disconnected: ${socket.id}`);
    //   // Optionally clear socketId from User/Captain here if desired
    // });

socket.on("disconnect", async () => {
  console.log(`Client disconnected: ${socket.id}`);
  try {
    await User.updateOne({ socketId: socket.id }, { $unset: { socketId: "" } });
    await Captain.updateOne({ socketId: socket.id }, { $unset: { socketId: "" } });
  } catch (error) {
    console.error("Error clearing socketId on disconnect:", error);
  }
});


  });
};

export const sendMessageToSocketId = (socketId, messageObject) => {
  if (io) {
    console.log(`Sending message to socket ID: ${socketId} with event: ${messageObject.event}`);
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};
