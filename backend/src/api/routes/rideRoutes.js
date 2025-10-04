import { Router } from "express";
import {
  requestRide,
  getRideFare,
  acceptRide,
  startRideByCaptain,
  endRideByCaptain,
} from "../controllers/rideController.js";

import {
  validateCreateRide,
  validateGetFare,
  validateConfirmRide,
  validateStartRideBody,
  validateEndRide,
} from "../middlewares/validation/rideValidation.js";

import { handleValidationErrors } from "../middlewares/validation/validationHandler.js";
import { authenticateUser, authenticateCaptain } from "../middlewares/authMiddleware.js";

const router = Router();

// User requests a new ride
router.post(
  "/request-ride",
  authenticateUser,
  validateCreateRide,
  handleValidationErrors,
  requestRide
);

// Get fare estimate
router.get(
  "/get-fare",
  authenticateUser,
  validateGetFare,
  handleValidationErrors,
  getRideFare
);

// Captain accepts a ride request
router.post(
  "/accept-ride",
  authenticateCaptain,
  validateConfirmRide,
  handleValidationErrors,
  acceptRide
);

// Captain starts the ride after OTP verification – POST with body
router.post(
  "/start-ride",
  authenticateCaptain,
  validateStartRideBody,
  handleValidationErrors,
  startRideByCaptain
);

// Captain ends the ride
router.post(
  "/end-ride",
  authenticateCaptain,
  validateEndRide,
  handleValidationErrors,
  endRideByCaptain
);

export default router;
