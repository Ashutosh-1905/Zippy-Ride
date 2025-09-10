import { Router } from "express";

// Import controller functions
import {
  getCoordinates,
  getDistanceTimeController,
  getAutoSuggestions,
} from "../controllers/mapController.js";

// Import validation middlewares
import { validateAddress } from "../middlewares/validation/mapValidation.js";
import { handleValidationErrors } from "../middlewares/validation/validationHandler.js";

// Import other middlewares
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Route to get coordinates for a given address
router.get(
  "/get-coordinates",
  validateAddress,
  handleValidationErrors,
  authenticateToken,
  getCoordinates
);

// Route to get distance and time between two locations
router.get(
  "/get-distance-time",
  validateDistanceTime,
  handleValidationErrors,
  authenticateToken,
  getDistanceTimeController
);

// Route to get address suggestions
router.get(
  "/get-suggestions",

  validateSuggestions,
  handleValidationErrors,
  authenticateToken,
  getAutoSuggestions
);

export default router;