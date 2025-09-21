import { registerCaptain, loginCaptain, logoutCaptain } from "../services/captainService.js";
import catchAsync from "../../utils/catchAsync.js";
import config from "../../config/config.js";

export const register = catchAsync(async (req, res, next) => {
  const { newCaptain, token } = await registerCaptain(req.body);

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: config.env === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60,
  });

  res.status(201).json({
    message: "Captain registered successfully",
    captain: {
      id: newCaptain._id,
      fullName: `${newCaptain.fullname.firstName} ${newCaptain.fullname.lastName}`,
      email: newCaptain.email,
    },
    token,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { captain, token } = await loginCaptain(email, password);

  res.cookie("token", token, {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: config.env === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60,
  });

  res.status(200).json({
    message: "Logged in successfully",
    captain: {
      id: captain._id,
      fullName: `${captain.fullname.firstName} ${captain.fullname.lastName}`,
      email: captain.email,
    },
    token,
  });
});

export const profile = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      captain: req.captain,
    },
  });
});

export const logout = catchAsync(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new Error("No token provided"));
  }

  await logoutCaptain(token);

  res.clearCookie("token", {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: config.env === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
});
