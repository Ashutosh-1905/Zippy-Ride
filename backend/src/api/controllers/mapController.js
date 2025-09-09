import { getAddressCoordinates } from "../services/mapService.js";
import catchAsync from "../../utils/catchAsync.js";
import AppError from "../../utils/AppError.js";

export const getCoordinates = catchAsync(async(req, res, next) => {
    const { address } = req.query;

    const coordinates = await getAddressCoordinates(address);

    if (!coordinates) {
        return next(new AppError("Address nahi mila.", 404));
    }
    res.status(200).json({
        success: true,
        data: coordinates
    });
});
