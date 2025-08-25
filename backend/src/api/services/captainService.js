import bcrypt from "bcrypt";
import Captain from "../../models/Captain.js";

export const registerCaptain = async (captainData) => {
  const existingCaptain = await Captain.findOne({ email: captainData.email });
  if (existingCaptain) {
    throw new Error("A captain with this email already exists.");
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

  if (!captain) {
    throw new Error("Invalid Credentials");
  }

  const isMatch = await bcrypt.compare(password, captain.password);

  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }

  return captain;
};
