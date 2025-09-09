import { Router } from "express";
import { getCoordinates } from "../controllers/mapController.js";
import { validateAddress } from "../middlewares/validation/mapValidation.js";
// Ab yahaan handleValidationErrors nayi file se import ho raha hai
import { handleValidationErrors } from "../middlewares/validation/validationHandler.js";

const router = Router();

router.get(
  "/get-coordinates",
  validateAddress,
  handleValidationErrors,
  getCoordinates
);

export default router;
