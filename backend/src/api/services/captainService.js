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

  const existingPlate = await Captain.findOne({ "vehicle.plate": captainData.vehicle.plate });
  if (existingPlate) {
    throw new AppError("Vehicle plate already registered.", 409);
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(captainData.password, saltRounds);

  const newCaptain = new Captain({
    fullname: {
      firstName: captainData.fullname.firstName,
      lastName: captainData.fullname.lastName,
    },
    email: captainData.email,
    password: hashedPassword,
    vehicle: captainData.vehicle,
    // currentLocation can be added later or defaulted by client when available
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
  if (!token) return;
  await BlacklistToken.updateOne({ token }, { token }, { upsert: true });
};
