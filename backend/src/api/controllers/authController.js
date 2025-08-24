import User from "../../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../../utils/generateToken.js";
// import jwt from "jsonwebtoken";
// import config from "../../config/config.js";

// Register User
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User aleady exists with this email."
            });
        };

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Create jwt Token
        // const token = jwt.sign({ id: newUser._id }, config.jwtSecret, { expiresIn: "1h" });
        
        const token = generateToken(user._id);
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                email: newUser.email,
            },
            token
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Login User

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({
                message: "Invalid Credentials",
            });
        }

        // compare passwords

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Credentials",
            });
        }

        // Create JWT Token
        // const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "1h" });

        const token = generateToken();
        res.status(200).json({
            message: "Logged in successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                email: user.email,
            },
            token
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

