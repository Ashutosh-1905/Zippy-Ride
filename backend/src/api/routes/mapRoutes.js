import { Router } from "express";

// Import controller functions
import {
  getCoordinates,
  getDistanceTimeController,
  getAutoSuggestions,
} from "../controllers/mapController.js";

// Import validation middlewares
import { validateAddress, validateDistanceTime, validateSuggestions } from "../middlewares/validation/mapValidation.js";
import { handleValidationErrors } from "../middlewares/validation/validationHandler.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";




const router = Router();

// Route to get coordinates for a given address
router.get(
  "/get-coordinates",
  authenticateUser,
  validateAddress,
  handleValidationErrors,
  getCoordinates
);

// Route to get distance and time between two locations
router.get(
  "/get-distance-time",
  authenticateUser,
  validateDistanceTime,
  handleValidationErrors,
  getDistanceTimeController
);

// Route to get address suggestions
router.get(
  "/get-suggestions",
  authenticateUser,
  validateSuggestions,
  handleValidationErrors,
  getAutoSuggestions
);

export default router;
