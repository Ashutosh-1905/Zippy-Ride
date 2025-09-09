import { Router } from "express";
import { getCoordinates } from "../controllers/mapController.js";
import { validateAddress } from "../middlewares/validation/mapValidation.js";
import { handleValidationErrors } from "../middlewares/validation/userValidation.js";

const router = Router();

router.get(
  "/get-coordinates",
  validateAddress,
  handleValidationErrors,
  getCoordinates
);

export default router;
