import express from "express";

const app = express();
app.use(express.json());


app.use("/", (req, res) => {
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