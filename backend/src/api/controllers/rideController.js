import catchAsync from "../../utils/catchAsync.js";
import { createRide, confirmRide, startRide, endRide, getFare } from "../services/rideService.js";
import { getCaptainsInTheRadius, getAddressCoordinates } from "../services/mapService.js";
import { sendMessageToSocketId } from "../../utils/socket.js";
import AppError from "../../utils/AppError.js";
import User from "../../models/User.js";

export const requestRide = catchAsync(async (req, res, next) => {
  const { pickup, destination, vehicleType } = req.body;
  const { user } = req;

  console.log("New ride request:", pickup, destination, vehicleType);

  const newRide = await createRide({ user, pickup, destination, vehicleType });

  const pickupCoordinates = await getAddressCoordinates(pickup);
  if (!pickupCoordinates) {
    throw new AppError("Could not find coordinates for pickup location.", 400);
  }

  const captainsInRadius = await getCaptainsInTheRadius(
    pickupCoordinates.lon,
    pickupCoordinates.lat,
    10
  );

  const activeCaptains = captainsInRadius.filter(c => c.socketId);

  if (activeCaptains.length === 0) {
    console.log("No active captains found in radius with valid socketId");
  }

  activeCaptains.forEach((captain) => {
    sendMessageToSocketId(captain.socketId, {
      event: 'new-ride-request',
      data: newRide,
    });
  });

  res.status(201).json({
    message: "Ride requested successfully. Share the OTP with your captain.",
    ride: newRide,
  });
});

export const getRideFare = catchAsync(async (req, res, next) => {
  const { pickup, destination } = req.query;
  console.log("Fare request:", pickup, destination);
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

  const user = await User.findById(updatedRide.user);
  if (user && user.socketId) {
    sendMessageToSocketId(user.socketId, {
      event: "ride-accepted",
      data: updatedRide,
    });
  }

  res.status(200).json({
    message: "Ride accepted successfully.",
    ride: updatedRide,
  });
});

export const startRideByCaptain = catchAsync(async (req, res, next) => {
  const { rideId, otp } = req.body;
  const { captain } = req;

  if (!rideId || !otp) {
    throw new AppError("Ride ID and OTP are required to start the ride", 400);
  }

  const updatedRide = await startRide({ rideId, otp, captain });

  const user = await User.findById(updatedRide.user);
  if (user && user.socketId) {
    sendMessageToSocketId(user.socketId, {
      event: "ride-started",
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

  const user = await User.findById(updatedRide.user);
  if (user && user.socketId) {
    sendMessageToSocketId(user.socketId, {
      event: "ride-ended",
      data: updatedRide,
    });
  }

  res.status(200).json({
    message: "Ride ended successfully.",
    ride: updatedRide,
  });
});
