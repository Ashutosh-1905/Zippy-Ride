import bcrypt from "bcrypt";
import Captain from "../../models/Captain.js";
import generateToken from "../../utils/generateToken.js";
import AppError from "../../utils/AppError.js";
import BlacklistToken from "../../models/BlacklistToken.js";

export const registerCaptain = async (captainData) => {
  const existingCaptain = await Captain.findOne({ email: captainData.email });
  if (existingCaptain) {
    throw new AppError("A captain with this email already exists.", 409);
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(captainData.password, saltRounds);

  const newCaptain = new Captain({
    firstName: captainData.firstName,
    lastName: captainData.lastName,
    email: captainData.email,
    password: hashedPassword,
    vehicle: captainData.vehicle,
  });

  await newCaptain.save();

  const token = generateToken(newCaptain._id);

  return { newCaptain, token };
};

export const loginCaptain = async (email, password) => {
  const captain = await Captain.findOne({ email }).select("+password");

  if (!captain || !(await bcrypt.compare(password, captain.password))) {
    throw new AppError("Invalid Credentials", 401);
  }

  const token = generateToken(captain._id);

  return { captain, token };
};


export const logoutCaptain = async (token) => {
  // Check if the token is already blacklisted to prevent duplicates
  const isBlacklisted = await BlacklistToken.findOne({ token });
  if (!isBlacklisted) {
    await BlacklistToken.create({ token });
  }
};
