import {
  getAddressCoordinates,
  getDistanceTime,
  getAutoCompleteSuggestions,
} from "../services/mapService.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/AppError.js";

export const getCoordinates = catchAsync(async (req, res, next) => {
  const { address } = req.query;

  if (!address) {
    return next(new AppError("Address is required", 400));
  }

  const coordinates = await getAddressCoordinates(address);

  if (!coordinates) {
    return next(new AppError("Address not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: coordinates,
  });
});

// New controller function for getting distance and time
export const getDistanceTimeController = catchAsync(async (req, res, next) => {
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return next(new AppError("Origin and Destination are required", 400));
  }

  const result = await getDistanceTime(origin, destination);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

// New controller function for getting auto-complete suggestions
export const getAutoSuggestions = catchAsync(async (req, res, next) => {
  const { input } = req.query;

  if (!input) {
    return next(new AppError("Query input is required", 400));
  }

  const suggestions = await getAutoCompleteSuggestions(input);

  res.status(200).json({
    status: "success",
    data: suggestions,
  });
});