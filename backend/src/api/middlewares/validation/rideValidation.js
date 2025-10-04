import { body, query } from "express-validator";

export const validateCreateRide = [
  body("pickup")
    .isString()
    .withMessage("Pickup address must be a string.")
    .isLength({ min: 3 })
    .withMessage("Pickup address must be at least 3 characters long."),
  body("destination")
    .isString()
    .withMessage("Destination address must be a string.")
    .isLength({ min: 3 })
    .withMessage("Destination address must be at least 3 characters long."),
  body("vehicleType")
    .isString()
    .isIn(["car", "motorcycle", "auto"])
    .withMessage("Invalid vehicle type."),
];

export const validateGetFare = [
  query("pickup")
    .isString()
    .withMessage("Pickup address must be a string.")
    .isLength({ min: 3 })
    .withMessage("Pickup address must be at least 3 characters long."),
  query("destination")
    .isString()
    .withMessage("Destination address must be a string.")
    .isLength({ min: 3 })
    .withMessage("Destination address must be at least 3 characters long."),
];

export const validateConfirmRide = [
  body("rideId")
    .isMongoId()
    .withMessage("Invalid ride ID.")
];

export const validateStartRideBody = [
  body("rideId")
    .isMongoId()
    .withMessage("Invalid ride ID."),
  body("otp")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits.")
];

export const validateEndRide = [
  body("rideId")
    .isMongoId()
    .withMessage("Invalid ride ID.")
];
