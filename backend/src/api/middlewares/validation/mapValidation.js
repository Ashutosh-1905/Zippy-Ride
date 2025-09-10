import { query } from "express-validator";
import { handleValidationErrors } from "./validationHandler.js";

export const validateAddress = [
  query("address")
    .isString()
    .withMessage("Address must be a string.")
    .isLength({ min: 3 })
    .withMessage("Address must be at least 3 characters long."),
  handleValidationErrors,
];

// New validation for the distance-time route
export const validateDistanceTime = [
  query("origin")
    .isString()
    .withMessage("Origin must be a string.")
    .isLength({ min: 3 })
    .withMessage("Origin must be at least 3 characters long."),
  query("destination")
    .isString()
    .withMessage("Destination must be a string.")
    .isLength({ min: 3 })
    .withMessage("Destination must be at least 3 characters long."),
];

// New validation for the suggestions route
export const validateSuggestions = [
  query("input")
    .isString()
    .withMessage("Input must be a string.")
    .isLength({ min: 3 })
    .withMessage("Input must be at least 3 characters long."),
];