import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import BlacklistToken from "../../models/BlacklistToken.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/AppError.js";

export const authenticateToken = catchAsync(async(req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return next(new AppError("Access denied. No token Provided.", 401));
    };
    
    const isTokenBlacklisted = await BlacklistToken.findOne({ token });

    if (isTokenBlacklisted) {
      return next(new AppError("Invalid token. Token has been blacklisted.", 401));
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
});
