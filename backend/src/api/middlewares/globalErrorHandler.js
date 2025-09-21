import config from "../../config/config.js";

const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong.";

  // Log the full error in the console for debugging
  console.error(err);

  const response = {
    status: err.status || (statusCode >= 500 ? "error" : "fail"),
    message,
  };

  if (config.env === "development") {
    response.errorStack = err.stack;
    response.originalError = err;
  }

  res.status(statusCode).json(response);
};

export default globalErrorHandler;
