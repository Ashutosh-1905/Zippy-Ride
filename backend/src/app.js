import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./api/routes/userRoutes.js"
import captainRoutes from "./api/routes/captainRoutes.js";
import mapRoutes from "./api/routes/mapRoutes.js";
import rideRoutes from "./api/routes/rideRoutes.js";
import globalErrorHandler from "./api/middlewares/globalErrorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/captains", captainRoutes);
app.use("/api/v1/maps", mapRoutes);
app.use("/api/v1/rides", rideRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "welcome to Uber."
    });
});

app.use(globalErrorHandler);

export default app;