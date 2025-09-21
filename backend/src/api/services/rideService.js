import Ride from "../../models/Ride.js";
import AppError from "../../utils/AppError.js";
import crypto from "crypto";
import { getDistanceTime } from "./mapService.js";

// Helper function to generate a random OTP
function getOtp(length) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return crypto.randomInt(min, max).toString();
}

const FARE_RATES = {
  car: { base: 50, perKm: 15, perMinute: 3 },
  motorcycle: { base: 20, perKm: 8, perMinute: 1.5 },
  auto: { base: 30, perKm: 10, perMinute: 2 },
};

export const calculateFare = async (pickup, destination) => {
  const { distance, duration } = await getDistanceTime(pickup, destination);

  const fares = {};
  for (const type in FARE_RATES) {
    const { base, perKm, perMinute } = FARE_RATES[type];
    const calculatedFare =
      base +
      (distance.value / 1000) * perKm +
      (duration.value / 60) * perMinute;
    fares[type] = Math.round(calculatedFare);
  }
  return fares;
};

export const createRide = async ({ user, pickup, destination, vehicleType }) => {
  const fares = await calculateFare(pickup, destination);
  const rideFare = fares[vehicleType];

  if (!rideFare) {
    throw new AppError("Invalid vehicle type for fare calculation.", 400);
  }

  const { distance, duration } = await getDistanceTime(pickup, destination);

  const newRide = await Ride.create({
    user: user._id,
    pickup,
    destination,
    fare: rideFare,
    distance: distance.value,
    duration: duration.value,
    otp: getOtp(6),
  });

  return newRide;
};

export const confirmRide = async ({ rideId, captain }) => {
  const ride = await Ride.findByIdAndUpdate(
    rideId,
    {
      status: "accepted",
      captain: captain._id,
    },
    { new: true }
  )
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new AppError("Ride not found.", 404);
  }
  return ride;
};

// Captain OTP verification ke baad ride shuru karega
export const startRide = async ({ rideId, otp, captain }) => {
  const ride = await Ride.findById(rideId).populate("user").select("+otp");

  if (!ride) {
    throw new AppError("Ride not found.", 404);
  }

  // Captain match check
  if (ride.captain.toString() !== captain._id.toString()) {
    throw new AppError("You are not the assigned captain for this ride.", 403);
  }

  // OTP verification
  if (ride.otp !== otp) {
    throw new AppError("Invalid OTP.", 400);
  }

  // Update ride status to 'ongoing'
  const updatedRide = await Ride.findByIdAndUpdate(
    rideId,
    { status: "ongoing", startTime: new Date() },
    { new: true }
  )
    .populate("user")
    .populate("captain");

  return updatedRide;
};

// Captain ride ko end karega
export const endRide = async ({ rideId, captain }) => {
  const ride = await Ride.findById(rideId).populate("user").populate("captain");

  if (!ride) {
    throw new AppError("Ride not found.", 404);
  }

  // Captain check
  const rideCaptainId =
    typeof ride.captain === "object" ? ride.captain._id : ride.captain;
  if (rideCaptainId.toString() !== captain._id.toString()) {
    throw new AppError("You are not the assigned captain for this ride.", 403);
  }

  // Sirf ongoing ride ko hi end kar sakte hain
  if (ride.status !== "ongoing") {
    throw new AppError("Ride is not currently ongoing.", 400);
  }

  // Update ride status to 'completed'
  const updatedRide = await Ride.findByIdAndUpdate(
    rideId,
    { status: "completed", endTime: new Date() },
    { new: true }
  )
    .populate("user")
    .populate("captain");

  return updatedRide;
};

export const getFare = async (pickup, destination) => {
  return await calculateFare(pickup, destination);
};
