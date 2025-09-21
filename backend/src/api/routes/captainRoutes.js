import { Router } from "express";

import { validateCaptainRegistration, validateCaptainLogin } from "../middlewares/validation/captainValidation.js";
import { login, logout, profile, register } from "../controllers/captainController.js";
import { authenticateCaptain } from "../middlewares/authMiddleware.js";
import { handleValidationErrors } from "../middlewares/validation/validationHandler.js";

const router = Router();

router.post("/register", validateCaptainRegistration, handleValidationErrors, register);
router.post("/login", validateCaptainLogin, handleValidationErrors, login);

router.get("/profile", authenticateCaptain, profile);
router.post("/logout", authenticateCaptain, logout);

export default router;
