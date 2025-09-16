import { body } from "express-validator";

export const validateUserRegistration = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required."),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required."),
  body("email")
    .isEmail()
    .withMessage("Invalid email address."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

export const validateUserLogin = [
    body("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email address.")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required.")
];