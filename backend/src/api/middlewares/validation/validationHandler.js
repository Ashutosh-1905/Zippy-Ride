import { validationResult } from "express-validator";

// Yeh ek generic middleware hai jo kisi bhi validation chain ke baad
// errors ko check karke handle karta hai. Isse reusable banane ke liye
// ek alag file mein rakha gaya hai.
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
