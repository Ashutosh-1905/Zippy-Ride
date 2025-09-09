import { body } from "express-validator";

// Ab yahan sirf validation ke rules hain. Error handling ka middleware
// ek alag file se import hoga.
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
    .normalizeEmail(), // Sanitizes the email to lowercase

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
