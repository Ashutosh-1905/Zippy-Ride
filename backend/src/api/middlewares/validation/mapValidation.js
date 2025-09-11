import { query } from "express-validator";

export const validateAddress = [
  query("address")
    .isString()
    .withMessage("Address must be a string.")
    .isLength({ min: 3 })
    .withMessage("Address must be at least 3 characters long."),
];

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

export const validateSuggestions = [
  query("input")
    .isString()
    .withMessage("Input must be a string.")
    .isLength({ min: 3 })
    .withMessage("Input must be at least 3 characters long."),
];
