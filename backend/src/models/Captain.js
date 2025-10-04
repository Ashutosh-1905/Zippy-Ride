import { model, Schema } from "mongoose";

const captainSchema = new Schema(
  {
    fullname: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
    },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    status: { type: String, enum: ["active", "inactive", "on-trip"], default: "inactive" },
    socketId: { type: String },
    vehicle: {
      color: { type: String, required: true },
      plate: { type: String, required: true, unique: true, trim: true },
      capacity: { type: Number, required: true, min: 1 },
      vehicleType: { type: String, required: true, enum: ["car", "motorcycle", "auto"] },
    },
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [77.4126, 23.2599], // Default: Bhopal [lng, lat] (modify for your locale)
        index: "2dsphere",
      },
    },
  },
  { timestamps: true }
);

const Captain = model("Captain", captainSchema);

export default Captain;
