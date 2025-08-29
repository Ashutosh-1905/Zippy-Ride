import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import BlacklistToken from "../../models/BlacklistToken.js";


export const authenticateToken = async(req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token Provided."
        });
    };

    // Check if the token is in the blacklist

     try {
    const isTokenBlacklisted = await BlacklistToken.findOne({ token });

    if (isTokenBlacklisted) {
      return res.status(401).json({
        message: "Invalid token. Token has been blacklisted.",
      });
    }
  } catch (err) {
    // Handle potential database errors
    console.error("Database error while checking blacklist:", err);
    return res.status(500).json({
      message: "Server error during authentication.",
    });
  }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({
            message: "Invalid token."
        });
    }
};

