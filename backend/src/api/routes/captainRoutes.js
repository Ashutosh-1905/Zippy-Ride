import { Router } from "express";

import { validateCaptainRegistration } from "../middlewares/validation/captainValidation.js";
import { login, logout, profile, register } from "../controllers/captainController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
// Ab yahaan handleValidationErrors nayi file se import ho raha hai
import { handleValidationErrors } from "../middlewares/validation/validationHandler.js";

const router = Router();

router.post("/register", validateCaptainRegistration, handleValidationErrors, register);
router.post("/login", handleValidationErrors, login);


router.get("/profile", authenticateToken, profile);
router.post("/logout", authenticateToken, logout);

export default router;
