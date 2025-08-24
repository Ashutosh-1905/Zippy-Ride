import jwt from "jsonwebtoken";
import config from "../../config/config";


export const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access denied. No token Provided."
        });
    };

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

