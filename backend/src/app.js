import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./api/routes/userRoutes.js"
import captainRoutes from "./api/routes/captainRoutes.js";
import globalErrorHandler from "./api/middlewares/globalErrorHandler.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/captains", captainRoutes);

app.get("/", (req, res) => {
    try {
        res.status(200).json({
            message: "welcom to Uber "
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Something went Wrong."
        });
    };
});


app.use(globalErrorHandler);

export default app;