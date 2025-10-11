import Ride from "../../models/Ride.js";
import AppError from "../../utils/AppError.js";
import { getDistanceTime } from "./mapService.js";
import { sendOtpEmail } from "./emailService.js";

// Helper function to generate a random 6-digit OTP
function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const FARE_RATES = {
  car: { base: 50, perKm: 12, perMinute: 3 },
  motorcycle: { base: 20, perKm: 6, perMinute: 1.5 },
  auto: { base: 30, perKm: 9, perMinute: 2 },
};

// Calculates fare, distance, and duration in one go
export const calculateFare = async (pickup, destination) => {
  const { distance, duration } = await getDistanceTime(pickup, destination);

  const fares = {};
  for (const type in FARE_RATES) {
    const { base, perKm, perMinute } = FARE_RATES[type];
    const calculatedFare =
      base +
      (distance.value / 1000) * perKm + // distance in km
      (duration.value / 60) * perMinute; // duration in minutes
    fares[type] = Math.round(calculatedFare);
  }
  return { fares, distance, duration };
};

export const createRide = async ({ user, pickup, destination, vehicleType }) => {
  // OPTIMIZATION: One call for geo data
  const { fares, distance, duration } = await calculateFare(
    pickup,
    destination
  );
  const rideFare = fares[vehicleType];

  if (!rideFare) {
    throw new AppError("Invalid vehicle type for fare calculation.", 400);
  }

  // OPTIMIZATION: Create ride and get the populated document in one operation flow
  const newRide = await Ride.create({
    user: user._id,
    pickup,
    destination,
    fare: rideFare,
    distance: distance.value,
    duration: duration.value,
  });

  // Fetch the created document with populated user for socket notification
  const populatedRide = await newRide.populate("user");
  return populatedRide;
};

// Handles OTP generation, atomic DB update, and email sending
export const acceptRide = async ({ rideId, captain }) => {
  const otpCode = generateOtp();
  const updatedRide = await Ride.findByIdAndUpdate(
    rideId,
    { $set: { status: "accepted", captain: captain._id, otp: otpCode } },
    { new: true, runValidators: true }
  )
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!updatedRide) {
    throw new AppError("Ride not found or already accepted/completed.", 404);
  }

  const userDoc = updatedRide.user;

  // Send OTP via email and get socketId from populated user
  let userSocketId = null;
  if (userDoc) {
    userSocketId = userDoc.socketId; // Get socketId directly from populated user
    // sendOtpEmail logs its own failure, no need for try/catch here
    await sendOtpEmail(userDoc.email, otpCode);
  }

  // Return necessary data for the controller's socket notification
  return { updatedRide, userSocketId };
};

// handles OTP validation and clearing atomically
export const startRide = async ({ rideId, otp, captain }) => {
  // Initial find: must select +otp
  const ride = await Ride.findById(rideId).populate("user").select("+otp");

  if (!ride) {
    throw new AppError("Ride not found.", 404);
  }

  // Captain authorization
  if (ride.captain?.toString() !== captain._id.toString()) {
    throw new AppError("You are not the assigned captain for this ride.", 403);
  }

  // OTP and Status verification (trimming ensures robustness against whitespace)
  if (String(ride.otp ?? "").trim() !== String(otp ?? "").trim()) {
    throw new AppError("Invalid OTP.", 400);
  }

  if (ride.status !== "accepted") {
    throw new AppError("Ride is not in accepted status.", 400);
  }

  // Atomically update status and clear OTP
  const updatedRide = await Ride.findByIdAndUpdate(
    rideId,
    { $set: { status: "ongoing", startTime: new Date() }, $unset: { otp: "" } },
    { new: true }
  )
    .populate("user")
    .populate("captain");

  return updatedRide;
};

export const endRide = async ({ rideId, captain }) => {
  const ride = await Ride.findById(rideId).populate("user").populate("captain");

  if (!ride) {
    throw new AppError("Ride not found.", 404);
  }

  // Captain authorization (safe access to captain ID)
  const rideCaptainId = ride.captain?._id ?? ride.captain;
  if (rideCaptainId.toString() !== captain._id.toString()) {
    throw new AppError("You are not the assigned captain for this ride.", 403);
  }

  if (ride.status !== "ongoing") {
    throw new AppError("Ride is not currently ongoing.", 400);
  }

  const updatedRide = await Ride.findByIdAndUpdate(
    rideId,
    { status: "completed", endTime: new Date() },
    { new: true }
  )
    .populate("user")
    .populate("captain");

  console.log("Ride ended successfully");
  return updatedRide;
};

export const getFare = async (pickup, destination) => {
  const { fares } = await calculateFare(pickup, destination);
  return fares;
};