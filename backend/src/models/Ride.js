import { model, Schema } from "mongoose";

const rideSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required."]
    },
    captain: {
        type: Schema.Types.ObjectId,
        ref: "Captain",
    },
    pickup: {
        type: String,
        required: [true, "Pickup address is required."],
    },
    destination: {
        type: String,
        required: [true, "Destination address is required."]
    },
    fare: {
        type: Number,
        required: [true, "Fare is required."]
    },
    status: {
        type: String,
       enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
        default: "pending"
    },
    duration: {
        type: Number,
    }, // in seconds
    distance: {
        type: Number
    }, // in meters
    paymentId: {
        type: String,
    },
    orderId: {
        type: String
    },
    signature: {
        type: String
    },
    otp: {
        type: String,
        required: [true, "OTP is required."],
        select: false,
    },
}, { timestamps: true });

const Ride = model("Ride", rideSchema);

export default Ride;