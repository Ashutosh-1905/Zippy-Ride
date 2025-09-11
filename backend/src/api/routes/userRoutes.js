import { Router } from "express";
import { login, logout, profile, register } from "../controllers/userController.js";
import { validateUserRegistration } from "../middlewares/validation/userValidation.js";


import { handleValidationErrors } from "../middlewares/validation/validationHandler.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = Router();

router.post(
  "/register",
  validateUserRegistration,
  handleValidationErrors,
  register
);

router.post("/login", handleValidationErrors, login);

router.get("/profile", authenticateUser, profile);
router.post("/logout", authenticateUser, logout);


export default router;
