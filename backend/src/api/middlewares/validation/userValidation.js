import { body } from "express-validator";

export const validateUserRegistration = [
  body("fullname.firstName")
    .notEmpty()
    .withMessage("First name is required.")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long."),
  body("fullname.lastName")
    .notEmpty()
    .withMessage("Last name is required.")
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters long."),
  body("email")
    .isEmail()
    .withMessage("Invalid email address.")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
];

export const validateUserLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email address.")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
];
