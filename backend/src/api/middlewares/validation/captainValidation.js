import { body } from "express-validator";

export const validateCaptainRegistration = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required.")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long."),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required.")
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters long."),

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  body("vehicle.color")
    .notEmpty()
    .withMessage("Vehicle color is required.")
    .isLength({ min: 3 })
    .withMessage("Color must be at least 3 characters long."),

  body("vehicle.plate")
    .notEmpty()
    .withMessage("Vehicle plate is required.")
    .isLength({ min: 3 })
    .withMessage("Plate must be at least 3 characters long."),

  body("vehicle.capacity")
    .isNumeric()
    .withMessage("Vehicle capacity must be a number.")
    .isInt({ min: 1 })
    .withMessage("Capacity must be at least 1."),

  body("vehicle.vehicleType")
    .notEmpty()
    .withMessage("Vehicle type is required.")
    .isIn(["car", "motorcycle", "auto"])
    .withMessage("Invalid vehicle type."),
];

export const validateCaptainLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
];