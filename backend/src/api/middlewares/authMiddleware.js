import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import BlacklistToken from "../../models/BlacklistToken.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/AppError.js";
import User from "../../models/User.js";
import Captain from "../../models/Captain.js";

// Middleware to authenticate users
export const authenticateUser = catchAsync(async (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return next(new AppError("Access denied. No token Provided.", 401));
    }

    const isTokenBlacklisted = await BlacklistToken.findOne({ token });

    if (isTokenBlacklisted) {
        return next(new AppError("Invalid token. Token has been blacklisted.", 401));
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
        return next(new AppError("User not found.", 404));
    }

    req.user = user;
    next();
});

// Middleware to authenticate captains
export const authenticateCaptain = catchAsync(async (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return next(new AppError("Access denied. No token Provided.", 401));
    }

    const isTokenBlacklisted = await BlacklistToken.findOne({ token });

    if (isTokenBlacklisted) {
        return next(new AppError("Invalid token. Token has been blacklisted.", 401));
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const captain = await Captain.findById(decoded.id);

    if (!captain) {
        return next(new AppError("Captain not found.", 404));
    }

    req.captain = captain;
    next();
});