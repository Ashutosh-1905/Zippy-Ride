import { Server } from "socket.io";
import User from "../models/User.js";
import Captain from "../models/Captain.js";

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
            try {
                if (userType === 'user') {
                    await User.findByIdAndUpdate(userId, { socketId: socket.id });
                    console.log(`User ${userId} joined with socket ID: ${socket.id}`);
                } else if (userType === 'captain') {
                    await Captain.findByIdAndUpdate(userId, { socketId: socket.id });
                    console.log(`Captain ${userId} joined with socket ID: ${socket.id}`);
                }
            } catch (error) {
                console.error("Error joining socket:", error);
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;
            if (location && location.lat && location.lng) {
                try {
                    await Captain.findByIdAndUpdate(userId, {
                        currentLocation: {
                            lat: location.lat,
                            lng: location.lng,
                        }
                    });
                } catch (error) {
                    console.error("Error updating captain location:", error);
                }
            } else {
                socket.emit('error', { message: 'Invalid location data' });
            }
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
};

export const sendMessageToSocketId = (socketId, messageObject) => {
    if (io) {
        console.log(`Sending message to socket ID: ${socketId} with event: ${messageObject.event}`);
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
};