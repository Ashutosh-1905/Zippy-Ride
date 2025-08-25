import User from "../../models/User.js";
import generateToken from "../../utils/generateToken.js";
import bcrypt from "bcrypt";

// Register User
export const registerUser = async (userData) => {
  const { firstName, lastName, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists with this email.");
  }


  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    firstName:userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: hashedPassword,
  });

  await newUser.save();

  const token = generateToken(newUser._id);

  return { newUser, token };
};

// Login User
export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid Credentials");
  }

  // comparePassword
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }

  const token = generateToken(user._id);

  return { user, token };
};
