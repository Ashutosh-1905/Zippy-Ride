import Captain from "../../models/Captain.js";
import bcrypt from "bcrypt";
import generateToken from "../../utils/generateToken.js";

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      color,
      plate,
      capacity,
      vehicleType,
    } = req.body;

    const existingCaptain = await Captain.findOne({ email });
    if (existingCaptain) {
      return res.status(400).json({
        message: "Captain already exists with this email.",
      });
    }

    const newCaptain = new Captain({
      firstName,
      lastName,
      email,
      password, // Mongoose pre-save hook can hash the password
      vehicle: {
        color,
        plate,
        capacity,
        vehicleType,
      },
    });

    const hashedPassword = await bcrypt.hash(newCaptain.password, 10);
    newCaptain.password = hashedPassword;

    await newCaptain.save();

    const token = generateToken(newCaptain._id);
    res.status(201).json({
      message: "Captain registered successfully",
      captain: {
        id: newCaptain._id,
        firstName: newCaptain.firstName,
        email: newCaptain.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const captain = await Captain.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, captain.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(captain._id);

    res.status(200).json({
      message: "Logged in successfully",
      captain: {
        id: captain._id,
        firstName: captain.firstName,
        email: captain.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


