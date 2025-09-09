import { Router } from "express";
import { login, logout, profile, register } from "../controllers/userController.js";
import { validateUserRegistration } from "../middlewares/validation/userValidation.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

import { handleValidationErrors } from "../middlewares/validation/validationHandler.js";

const router = Router();

router.post(
  "/register",
  validateUserRegistration,
  handleValidationErrors,
  register
);

router.post("/login", handleValidationErrors, login);

router.get("/profile", authenticateToken, profile);
router.post("/logout", authenticateToken, logout);


export default router;
