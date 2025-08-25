import express from "express";
import cors from "cors";
import authRoutes from "./api/routes/authRoutes.js"
import captainRoutes from "./api/routes/captainRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/users", authRoutes);
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

export default app;