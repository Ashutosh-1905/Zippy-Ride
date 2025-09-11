import catchAsync from "../../utils/catchAsync.js";
import { createRide, confirmRide, startRide, endRide, getFare } from "../services/rideService.js";


export const requestRide = catchAsync(async (req, res, next) => {
    const { pickup, destination, vehicleType } = req.body;
    const { user } = req;

    const newRide = await createRide({ user, pickup, destination, vehicleType });

    res.status(201).json({
        message: "Ride request submitted. Waiting for a captain...",
        ride: newRide,
    });
});

export const getRideFare = catchAsync(async (req, res, next) => {
    const { pickup, destination } = req.query;
    const fares = await getFare(pickup, destination);
    res.status(200).json({
        message: "Fare calculated successfully.",
        fares,
    });
});

export const acceptRide = catchAsync(async (req, res, next) => {
    const { rideId } = req.body;
    const { captain } = req;

    const updatedRide = await confirmRide({ rideId, captain });

  
    res.status(200).json({
        message: "Ride accepted successfully.",
        ride: updatedRide,
    });
});

export const startRideByCaptain = catchAsync(async (req, res, next) => {
    const { rideId, otp } = req.query;
    const { captain } = req;

    const updatedRide = await startRide({ rideId, otp, captain });



    res.status(200).json({
        message: "Ride started successfully.",
        ride: updatedRide,
    });
});

export const endRideByCaptain = catchAsync(async (req, res, next) => {
    const { rideId } = req.body;
    const { captain } = req;

    const updatedRide = await endRide({ rideId, captain });


    res.status(200).json({
        message: "Ride ended successfully.",
        ride: updatedRide,
    });
});