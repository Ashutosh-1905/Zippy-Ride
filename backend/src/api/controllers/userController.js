import catchAsync from "../../utils/catchAsync.js";
import { registerUser, loginUser, logoutUser } from "../services/userService.js";
import AppError from "../../utils/AppError.js";
import config from "../../config/config.js";

// Register User
export const register = catchAsync(async (req, res, next) => {
  const { newUser, token } = await registerUser(req.body);

  // Set httpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: config.env === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60, // 1 hour (same as token)
  });

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser._id,
      fullName: `${newUser.fullname.firstName} ${newUser.fullname.lastName}`,
      email: newUser.email,
    },
    token,
  });
});

// Login User
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { user, token } = await loginUser(email, password);

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: config.env === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60, // 1 hour
  });

  res.status(200).json({
    message: "Logged in successfully",
    user: {
      id: user._id,
      fullName: `${user.fullname.firstName} ${user.fullname.lastName}`,
      email: user.email,
    },
    token,
  });
});

// Profile
export const profile = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

// Logout
export const logout = catchAsync(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError("No token provided", 401));
  }

  await logoutUser(token);
  res.clearCookie("token", {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: config.env === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});
