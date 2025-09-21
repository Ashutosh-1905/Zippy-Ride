import { model, Schema } from "mongoose";

const captainSchema = new Schema(
  {
    fullname: {
      firstName: {
        type: String,
        required: [true, "First name is required."],
        minlength: [3, "First name must be at least 3 characters long."],
        trim: true,
      },
      lastName: {
        type: String,
        required: [true, "Last name is required."],
        minlength: [3, "Last name must be at least 3 characters long."],
        trim: true,
      },
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters long."],
      select: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "on-trip"],
      default: "inactive",
    },
    socketId: {
      type: String,
      required: false,
    },
    vehicle: {
      type: {
        color: {
          type: String,
          required: [true, "Vehicle color is required."],
          minlength: [3, "Color must be at least 3 characters long."],
        },
        plate: {
          type: String,
          required: [true, "Vehicle plate is required."],
          minlength: [3, "Plate must be at least 3 characters long."],
          trim: true,
          unique: [true, "Vehicle plate number should be unique"],
        },
        capacity: {
          type: Number,
          required: [true, "Vehicle capacity is required."],
          min: [1, "Capacity must be at least 1."],
        },
        vehicleType: {
          type: String,
          required: [true, "Vehicle type is required."],
          enum: ["car", "motorcycle", "auto"],
        },
      },
      required: [true, "Vehicle information is required."],
    },

    // currentLocation: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //       default: "Point",
    //       required:false
    //   },
    //   coordinates: {
    //     type: [Number], // [longitude, latitude],
    //       index: "2dsphere",
    //   },
    // },
     currentLocation: {
      type: {
        lat: Number,
        lng: Number,
      },
      required: false,
    },

  },
  {
    timestamps: true,
  }
);

// captainSchema.index({ currentLocation: "2dsphere" });
const Captain = model("Captain", captainSchema);

export default Captain;
