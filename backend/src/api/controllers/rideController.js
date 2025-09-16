import catchAsync from "../../utils/catchAsync.js";
import { createRide, confirmRide, startRide, endRide, getFare } from "../services/rideService.js";
import { getCaptainsInTheRadius, getAddressCoordinates } from "../services/mapService.js";
import { sendMessageToSocketId } from "../../utils/socket.js";
import AppError from "../../utils/AppError.js";
import User from "../../models/User.js";

export const requestRide = catchAsync(async (req, res, next) => {
    const { pickup, destination, vehicleType } = req.body;
    const { user } = req;

    const newRide = await createRide({ user, pickup, destination, vehicleType });

    const pickupCoordinates = await getAddressCoordinates(pickup);
    if (!pickupCoordinates) {
        throw new AppError("Could not find coordinates for pickup location.", 400);
    }
    
    // 5km radius mein active captains ko dhoondho
    const captainsInRadius = await getCaptainsInTheRadius(pickupCoordinates.lat, pickupCoordinates.lon, 5);
    
    // Ride details ko user details ke sath populate karo
    const rideWithUser = await newRide.populate('user');

    if (captainsInRadius.length > 0) {
        captainsInRadius.forEach(captain => {
            // Har captain ko new ride request bhejo
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride-request',
                data: rideWithUser,
            });
        });
    }

    res.status(201).json({
        message: "Ride request submitted. Waiting for a captain...",
        ride: newRide,
    });
});

export const getRideFare = catchAsync(async (req, res, next) => {
    const { pickup, destination } = req.query;
    const fares = await getFare(pickup, destination);
    res.status(200).json({
        message: "Fare calculated successfully.",
        fares,
    });
});

export const acceptRide = catchAsync(async (req, res, next) => {
    const { rideId } = req.body;
    const { captain } = req;

    const updatedRide = await confirmRide({ rideId, captain });
    
    // User ko notify karo ki ride accept ho gayi hai
    const user = await User.findById(updatedRide.user);
    if (user && user.socketId) {
        sendMessageToSocketId(user.socketId, {
            event: 'ride-accepted',
            data: updatedRide,
        });
    }

    res.status(200).json({
        message: "Ride accepted successfully.",
        ride: updatedRide,
    });
});

export const startRideByCaptain = catchAsync(async (req, res, next) => {
    const { rideId, otp } = req.query;
    const { captain } = req;

    const updatedRide = await startRide({ rideId, otp, captain });

    // User ko notify karo ki ride start ho gayi hai
    const user = await User.findById(updatedRide.user);
    if (user && user.socketId) {
        sendMessageToSocketId(user.socketId, {
            event: 'ride-started',
            data: updatedRide,
        });
    }

    res.status(200).json({
        message: "Ride started successfully.",
        ride: updatedRide,
    });
});

export const endRideByCaptain = catchAsync(async (req, res, next) => {
    const { rideId } = req.body;
    const { captain } = req;

    const updatedRide = await endRide({ rideId, captain });

    // User ko notify karo ki ride end ho gayi hai
    const user = await User.findById(updatedRide.user);
    if (user && user.socketId) {
        sendMessageToSocketId(user.socketId, {
            event: 'ride-ended',
            data: updatedRide,
        });
    }

    res.status(200).json({
        message: "Ride ended successfully.",
        ride: updatedRide,
    });
});