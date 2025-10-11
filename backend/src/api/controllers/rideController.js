import catchAsync from "../../utils/catchAsync.js";
import {
  createRide,
  startRide,
  endRide,
  getFare,
  acceptRide as acceptRideService, // Renamed to avoid collision
} from "../services/rideService.js";
import {
  getCaptainsInTheRadius,
  getAddressCoordinates,
}
from "../services/mapService.js";
import { sendMessageToSocketId } from "../../utils/socket.js";
import AppError from "../../utils/AppError.js";
import User from "../../models/User.js"; // Needed for start/end ride user lookup

// Constant for captain search radius
// const CAPTAIN_SEARCH_RADIUS_KM = 10;
const CAPTAIN_SEARCH_RADIUS_KM = 50000;  // just for testing purpose 


// User requests a new ride
export const requestRide = catchAsync(async (req, res, next) => {
  const { pickup, destination, vehicleType } = req.body;
  const { user } = req;

  // 1. Resolve pickup coordinates first (fail fast check)
  const pickupCoordinates = await getAddressCoordinates(pickup);
  if (!pickupCoordinates) {
    throw new AppError("Could not find coordinates for pickup location.", 400);
  }

  // 2. Create ride in DB (includes fare/distance/duration calculation)
  const newRide = await createRide({ user, pickup, destination, vehicleType });

  // 3. Find and notify captains nearby
  const captainsInRadius = await getCaptainsInTheRadius(
    pickupCoordinates.lon,
    pickupCoordinates.lat,
    CAPTAIN_SEARCH_RADIUS_KM
  );

  // Filter active captains with socket connections
  const activeCaptains = captainsInRadius.filter((c) => c.socketId);

  // Notify captains via socket (fire-and-forget)
  activeCaptains.forEach((captain) => {
    sendMessageToSocketId(captain.socketId, {
      event: "new-ride-request",
      data: newRide,
    });
  });

  res.status(201).json({
    message: "Ride requested successfully. Captains nearby have been notified to accept your request.",
    ride: newRide,
  });
});

// Get ride fare
export const getRideFare = catchAsync(async (req, res, next) => {
  const { pickup, destination } = req.query;
  const fares = await getFare(pickup, destination);

  res.status(200).json({
    message: "Fare calculated successfully.",
    fares,
  });
});

// Captain accepts ride
export const acceptRide = catchAsync(async (req, res, next) => {
  const { rideId } = req.body;
  const { captain } = req;

  // **OPTIMIZATION**: Delegation to service handles OTP generation, atomic DB update, and email send.
  const { updatedRide, userSocketId } = await acceptRideService({
    rideId,
    captain,
  });

  // Notify user via socket
  if (userSocketId) {
    sendMessageToSocketId(userSocketId, {
      event: "ride-accepted",
      data: updatedRide,
    });
  }

  res.status(200).json({
    message: "Ride accepted successfully.",
    // The service handles email sending, simplifying the controller's success message.
    ride: updatedRide,
  });
});

// Captain starts the ride after OTP verification
export const startRideByCaptain = catchAsync(async (req, res, next) => {
  const { rideId, otp } = req.body;
  const { captain } = req;

  if (!rideId || !otp) {
    throw new AppError("Ride ID and OTP are required to start the ride", 400);
  }

  // Service handles verification and state update
  const updatedRide = await startRide({ rideId, otp, captain });
  const user = await User.findById(updatedRide.user);

  // Notify user via socket
  if (user && user.socketId) {
    sendMessageToSocketId(user.socketId, {
      event: "ride-started",
      data: updatedRide,
    });
  }

  res
    .status(200)
    .json({ message: "Ride started successfully.", ride: updatedRide });
});

// Captain ends the ride
export const endRideByCaptain = catchAsync(async (req, res, next) => {
  const { rideId } = req.body;
  const { captain } = req;

  const updatedRide = await endRide({ rideId, captain });

  // Notify user via socket
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
