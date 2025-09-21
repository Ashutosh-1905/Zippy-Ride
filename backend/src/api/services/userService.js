import User from "../../models/User.js";
import BlacklistToken from "../../models/BlacklistToken.js";
import generateToken from "../../utils/generateToken.js";
import AppError from "../../utils/AppError.js";
import bcrypt from "bcrypt";

// Register User
export const registerUser = async (userData) => {
  const { email, password, fullname } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists with this email.", 409);
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    fullname: {
      firstName: fullname.firstName,
      lastName: fullname.lastName,
    },
    email: email,
    password: hashedPassword,
  });

  await newUser.save();

  const token = generateToken(newUser._id);

  return { newUser, token };
};

// Login User
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid Credentials", 401);
  }

  const token = generateToken(user._id);

  return { user, token };
};

export const logoutUser = async (token) => {
  if (!token) return;
  // Upsert to avoid race conditions and reduce operations
  await BlacklistToken.updateOne({ token }, { token }, { upsert: true });
};
