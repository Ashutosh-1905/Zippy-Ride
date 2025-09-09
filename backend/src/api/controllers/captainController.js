import { registerCaptain, loginCaptain, logoutCaptain } from "../services/captainService.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/AppError.js";

export const register = catchAsync(async (req, res, next) => {
  const { newCaptain, token } = await registerCaptain(req.body);

  res.status(201).json({
    message: "Captain registered successfully",
    captain: {
      id: newCaptain._id,
      firstName: newCaptain.firstName,
      email: newCaptain.email,
    },
    token,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { captain, token } = await loginCaptain(email, password);

  res.status(200).json({
    message: "Logged in successfully",
    captain: {
      id: captain._id,
      firstName: captain.firstName,
      email: captain.email,
    },
    token,
  });
});

export const profile = catchAsync(async(req, res, next)=>{
  res.status(200).json({
    status: 'success',
    data: {
      captain: req.captain
    }
  });
});


export const logout = catchAsync(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError("No token provided", 400));
  }

  await logoutCaptain(token);
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});
