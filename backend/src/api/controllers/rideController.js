import catchAsync from "../../utils/catchAsync.js";
import {
  createRide,
  startRide,
  endRide,
  getFare,
} from "../services/rideService.js";
import {
  getCaptainsInTheRadius,
  getAddressCoordinates,
} from "../services/mapService.js";
import { sendMessageToSocketId } from "../../utils/socket.js";
import AppError from "../../utils/AppError.js";
import User from "../../models/User.js";
import Ride from "../../models/Ride.js";
import { sendOtpEmail } from "../services/emailService.js";

// User requests a new ride
export const requestRide = catchAsync(async (req, res, next) => {
  const { pickup, destination, vehicleType } = req.body;
  const { user } = req;

  // Create ride in DB
  const newRide = await createRide({ user, pickup, destination, vehicleType });

  // Resolve pickup coordinates
  const pickupCoordinates = await getAddressCoordinates(pickup);
  if (!pickupCoordinates) {
    throw new AppError("Could not find coordinates for pickup location.", 400);
  }

  // Find captains nearby
  const captainsInRadius = await getCaptainsInTheRadius(
    pickupCoordinates.lon,
    pickupCoordinates.lat,
    10
  );

  // Filter active captains with socket connections
  const activeCaptains = captainsInRadius.filter((c) => c.socketId);

  // Notify captains via socket
  activeCaptains.forEach((captain) => {
    sendMessageToSocketId(captain.socketId, {
      event: "new-ride-request",
      data: newRide,
    });
  });

  res.status(201).json({
    message:
      "Ride requested successfully. Captains nearby have been notified to accept your request.",
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

// Captain accepts ride, saves OTP atomically!
export const acceptRide = catchAsync(async (req, res, next) => {
  const { rideId } = req.body;
  const { captain } = req;

  // Generate OTP and atomically update ride in DB
  const otpCode = String(Math.floor(100000 + Math.random() * 900000));
  const updatedRide = await Ride.findByIdAndUpdate(
    rideId,
    { $set: { status: "accepted", captain: captain._id, otp: otpCode } },
    { new: true }
  )
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!updatedRide) {
    throw new AppError("Ride not found.", 404);
  }

  // Send OTP via email to user
  const user = await User.findById(updatedRide.user);
  if (user) {
    try {
      await sendOtpEmail(user.email, otpCode);
      if (user.socketId) {
        sendMessageToSocketId(user.socketId, {
          event: "ride-accepted",
          data: updatedRide,
        });
      }
    } catch (error) {
      console.error("Error sending OTP email:", error);
    }
  }

  res.status(200).json({
    message: "Ride accepted successfully and OTP sent to your email.",
    ride: updatedRide,
  });
});

// ✅ Captain starts the ride after OTP verification (fixed version)
export const startRideByCaptain = catchAsync(async (req, res, next) => {
  const { rideId, otp } = req.body;
  const { captain } = req;

  if (!rideId || !otp) {
    console.log("Bad request: missing rideId or OTP");
    throw new AppError("Ride ID and OTP are required to start the ride", 400);
  }

  console.log("Start Ride Called -- RideId:", rideId, "OTP:", `"${otp}"`);

  // Let the service handle fetching, verifying, and updating
  const updatedRide = await startRide({ rideId, otp, captain });

  // Notify user via socket
  const user = await User.findById(updatedRide.user);
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
