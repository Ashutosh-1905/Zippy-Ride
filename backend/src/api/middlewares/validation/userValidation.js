import { body } from "express-validator";

// Ab yahan sirf validation ke rules hain. Error handling ka middleware
// ek alag file se import hoga.
export const validateUserRegistration = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];
