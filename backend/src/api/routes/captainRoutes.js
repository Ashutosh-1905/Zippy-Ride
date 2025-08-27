import { Router } from "express";

import { handleValidationErrors, validateCaptainRegistration } from "../middlewares/validation/captainValidation.js";
import { login, register } from "../controllers/captainController.js";

const router = Router();

router.post("/register", validateCaptainRegistration, handleValidationErrors, register);
router.post("/login", handleValidationErrors, login);

export default router;
