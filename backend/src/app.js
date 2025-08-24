import express from "express";
import cors from "cors";
import authRoutes from "./api/routes/authRoutes.js"

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/auth", authRoutes);
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