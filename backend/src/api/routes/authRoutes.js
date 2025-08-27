import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import { handleValidationErrors, validateUserRegistration } from "../middlewares/validation/userValidation.js";

const router = Router();

router.post(
  "/register",
  validateUserRegistration,
  handleValidationErrors,
  register
);

router.post("/login", handleValidationErrors, login);

export default router;
