import { query } from "express-validator";
import { handleValidationErrors } from "./userValidation.js";

export const validateAddress = [
  query("address")
    .isString()
    .withMessage("Address must be a string.")
    .isLength({ min: 3 })
    .withMessage("Address must be at least 3 characters long."),
  handleValidationErrors
];
