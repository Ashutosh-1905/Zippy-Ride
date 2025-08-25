import config from "../../config/config.js";

const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
     res.status(statusCode).json({
       message: err.message,
       errorStack:
         config.env === "development" ? err.stack : "Something went Wrong.",
     });
};

export default globalErrorHandler;