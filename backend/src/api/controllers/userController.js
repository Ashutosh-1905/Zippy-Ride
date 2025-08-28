import catchAsync from "../../utils/catchAsync.js";
import { registerUser, loginUser } from "../services/userService.js";

// Register User
export const register = catchAsync(async (req, res, next) => {
  const { newUser, token } = await registerUser(req.body);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser._id,
      firstName: newUser.firstName,
      email: newUser.email,
    },
    token,
  });
});

// Login User
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const { user, token } = await loginUser(email, password);

  res.status(200).json({
    message: "Logged in successfully",
    user: {
      id: user._id,
      firstName: user.firstName,
      email: user.email,
    },
    token,
  });
});