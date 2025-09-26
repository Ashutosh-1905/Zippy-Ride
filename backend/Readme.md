# Zippy Ride Backend – Ride Sharing Service

A Node.js backend for a ride-sharing app with **user and captain authentication**, ride management, and real-time updates using **Express, MongoDB, Mongoose, JWT, bcrypt, and Socket.io**.

---

## Table of Contents

1. [Project Setup](#project-setup)  
2. [Folder Structure](#folder-structure)  
3. [Environment Variables](#environment-variables)  
4. [Running the Server](#running-the-server)  
5. [API Endpoints](#api-endpoints)  
   * [Users API](#1-users-api-api-v1-users)  
   * [Captains API](#2-captains-api-api-v1-captains)  
   * [Ride API](#3-ride-api-api-v1-rides)  
   * [Map API](#4-map-api-api-v1-maps)  
6. [Authentication Flow](#authentication-flow)  
7. [Real-Time Updates with Socket.io](#real-time-updates-with-socketio)  
8. [Error Handling & Validation](#error-handling--validation)  
9. [Token Blacklisting](#token-blacklisting)  

---

## Project Setup

### Clone and Install

```bash
git clone <your-repo-url>
cd backend
npm install
````

### Environment Variables

Create a `.env` file in the root and configure:

| Variable      | Description                                 |
| ------------- | ------------------------------------------- |
| `SERVER_PORT` | Server port (e.g., 3000)                    |
| `MONGODB_URI` | MongoDB connection string                   |
| `NODE_ENV`    | Environment (`development` or `production`) |
| `JWT_SECRET`  | Secret key for JWT signing                  |
| `MAP_API_KEY` | API key for map services                    |

---

## Folder Structure

```
📁 backend/
├── 📄 Readme.md
├── 📄 package.json
├── 📄 server.js
└── 📁 src
    ├── 📁 api
    │   ├── 📁 controllers
    │   │   ├── 📄 captainController.js
    │   │   ├── 📄 mapController.js
    │   │   ├── 📄 rideController.js
    │   │   └── 📄 userController.js
    │   ├── 📁 middlewares
    │   │   ├── 📄 authMiddleware.js
    │   │   ├── 📄 globalErrorHandler.js
    │   │   └── 📁 validation
    │   │       ├── 📄 captainValidation.js
    │   │       ├── 📄 mapValidation.js
    │   │       ├── 📄 rideValidation.js
    │   │       ├── 📄 userValidation.js
    │   │       └── 📄 validationHandler.js
    │   ├── 📁 routes
    │   │   ├── 📄 captainRoutes.js
    │   │   ├── 📄 mapRoutes.js
    │   │   ├── 📄 rideRoutes.js
    │   │   └── 📄 userRoutes.js
    │   └── 📁 services
    │       ├── 📄 captainService.js
    │       ├── 📄 mapService.js
    │       ├── 📄 rideService.js
    │       └── 📄 userService.js
    ├── 📄 app.js
    ├── 📁 config
    │   ├── 📄 config.js
    │   └── 📄 connectDb.js
    ├── 📁 models
    │   ├── 📄 BlacklistToken.js
    │   ├── 📄 Captain.js
    │   ├── 📄 Ride.js
    │   └── 📄 User.js
    └── 📁 utils
        ├── 📄 AppError.js
        ├── 📄 catchAsync.js
        ├── 📄 generateToken.js
        └── 📄 socket.js
```

* `controllers/` → Handle API request logic
* `services/` → Business logic & database interactions
* `middlewares/` → Auth, validation, error handling
* `models/` → Mongoose schemas for Users, Captains, Rides
* `utils/` → Helper functions (JWT generation, async wrapper, socket events)

---

## Running the Server

* **Development:**

```bash
npm run dev
```

* **Production:**

```bash
npm start
```

Server runs on the port defined in `.env` (`SERVER_PORT`).

---

# API Endpoints

## 1. Users API (`/api/v1/users`)

### Register User

**Method:** POST
**URL:** `http://localhost:3000/api/v1/users/register`

**Body:**

```json
{
  "fullname": {
    "firstName": "Ashu",
    "lastName": "Dhakad"
  },
  "email": "ashu@gmail.com",
  "password": "12345678"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "68d68e6d763ead0d89c3d09d",
    "fullName": "Ashu Dhakad",
    "email": "ashu@gmail.com"
  },
  "token": "<JWT_TOKEN>"
}
```

---

### Login User

**Method:** POST
**URL:** `http://localhost:3000/api/v1/users/login`

**Body:**

```json
{
  "email": "ashu@gmail.com",
  "password": "12345678"
}
```

**Response:**

```json
{
  "message": "User logged in successfully",
  "user": {
    "id": "68d68e6d763ead0d89c3d09d",
    "fullName": "Ashu Dhakad",
    "email": "ashu@gmail.com"
  },
  "token": "<JWT_TOKEN>"
}
```

---

### Get User Profile

**Method:** GET
**URL:** `http://localhost:3000/api/v1/users/profile`

**Headers:**
`Authorization: Bearer <JWT_TOKEN>`

**Response:**

```json
{
  "user": {
    "id": "68d68e6d763ead0d89c3d09d",
    "fullName": "Ashu Dhakad",
    "email": "ashu@gmail.com"
  }
}
```

---

### Logout User

**Method:** POST
**URL:** `http://localhost:3000/api/v1/users/logout`

**Headers:**
`Authorization: Bearer <JWT_TOKEN>`

**Response:**

```json
{
  "message": "User logged out successfully"
}
```

---

## 2. Captains API (`/api/v1/captains`)

### Register Captain

**Method:** POST
**URL:** `http://localhost:3000/api/v1/captains/register`

**Body:**

```json
{
  "fullname": {
    "firstName": "Ramesh",
    "lastName": "Sharma"
  },
  "email": "ramesh@example.com",
  "password": "12345678",
  "vehicle": {
    "color": "Red",
    "plate": "MH12AB1234",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

**Response:**

```json
{
  "message": "Captain registered successfully",
  "captain": {
    "id": "68d69008763ead0d89c3d0a8",
    "fullName": "Ramesh Sharma",
    "email": "ramesh@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "MH12AB1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  },
  "token": "<JWT_TOKEN>"
}
```

---

### Login Captain

**Method:** POST
**URL:** `http://localhost:3000/api/v1/captains/login`

**Body:**

```json
{
  "email": "ramesh@example.com",
  "password": "12345678"
}
```

**Response:**

```json
{
  "message": "Captain logged in successfully",
  "captain": {
    "id": "68d69008763ead0d89c3d0a8",
    "fullName": "Ramesh Sharma",
    "email": "ramesh@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "MH12AB1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  },
  "token": "<JWT_TOKEN>"
}
```

---

### Get Captain Profile

**Method:** GET
**URL:** `http://localhost:3000/api/v1/captains/profile`

**Headers:**
`Authorization: Bearer <JWT_TOKEN>`

**Response:**

```json
{
  "captain": {
    "id": "68d69008763ead0d89c3d0a8",
    "fullName": "Ramesh Sharma",
    "email": "ramesh@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "MH12AB1234",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

---

### Logout Captain

**Method:** POST
**URL:** `http://localhost:3000/api/v1/captains/logout`

**Headers:**
`Authorization: Bearer <JWT_TOKEN>`

**Response:**

```json
{
  "message": "Captain logged out successfully"
}
```

---

## 3. Ride API (`/api/v1/rides`)

### Request a Ride

**Method:** POST
**URL:** `http://localhost:3000/api/v1/rides/request-ride`

**Headers:**
`Authorization: Bearer <USER_JWT_TOKEN>`

**Body:**

```json
{
  "pickup": "Indore",
  "destination": "Bhopal",
  "vehicleType": "car"
}
```

**Response:**

```json
{
  "message": "Ride request submitted. Waiting for a captain...",
  "ride": {
    "id": "68d69930763ead0d89c3d0bb",
    "user": {
      "id": "68d68e6d763ead0d89c3d09d",
      "fullName": "Ashu Dhakad",
      "email": "ashu@gmail.com"
    },
    "pickup": "Indore",
    "destination": "Bhopal",
    "fare": 3260,
    "status": "pending",
    "duration": 8520.2,
    "distance": 185603.9,
    "otp": "602676",
    "createdAt": "2025-09-26T13:46:24.544Z"
  }
}
```

---

### Get Fare Estimate

**Method:** GET
**URL:** `http://localhost:3000/api/v1/rides/get-fare?pickup=bhopal&destination=indore`

**Headers:**
`Authorization: Bearer <USER_JWT_TOKEN>`

**Response:**

```json
{
  "message": "Fare calculated successfully.",
  "fares": {
    "car": 3264,
    "motorcycle": 1720,
    "auto": 2173
  }
}
```

---

### Accept Ride (Captain)

**Method:** POST
**URL:** `http://localhost:3000/api/v1/rides/accept-ride`

**Headers:**
`Authorization: Bearer <CAPTAIN_JWT_TOKEN>`

**Body:**

```json
{
  "rideId": "68d69930763ead0d89c3d0bb"
}
```

**Response:**

```json
{
  "message": "Ride accepted successfully.",
  "ride": {
    "id": "68d69930763ead0d89c3d0bb",
    "status": "accepted",
    "captain": {
      "id": "68d69008763ead0d89c3d0a8",
      "fullName": "Ramesh Sharma",
      "email": "ramesh@example.com",
      "vehicle": {
        "color": "Red",
        "plate": "MH12AB1234",
        "capacity": 4,
        "vehicleType": "car"
      }
    }
  }
}
```

---

### Start Ride (Captain)

**Method:** POST
**URL:** `http://localhost:3000/api/v1/rides/start-ride`

**Headers:**
`Authorization: Bearer <CAPTAIN_JWT_TOKEN>`

**Body:**

```json
{
  "rideId": "68d69930763ead0d89c3d0bb",
  "otp": "602676"
}
```

**Response:**

```json
{
  "message": "Ride started successfully.",
  "ride": {
    "id": "68d69930763ead0d89c3d0bb",
    "status": "ongoing",
    "captain": {
      "id": "68d69008763ead0d89c3d0a8",
      "fullName": "Ramesh Sharma"
    }
  }
}
```

---

### End Ride (Captain)

**Method:** POST
**URL:** `http://localhost:3000/api/v1/rides/end-ride`

**Headers:**
`Authorization: Bearer <CAPTAIN_JWT_TOKEN>`

**Body:**

```json
{
  "rideId": "68d69930763ead0d89c3d0bb"
}
```

**Response:**

```json
{
  "message": "Ride ended successfully.",
  "ride": {
    "id": "68d69930763ead0d89c3d0bb",
    "status": "completed",
    "fare": 3260,
    "captain": {
      "id": "68d69008763ead0d89c3d0a8",
      "fullName": "Ramesh Sharma"
    }
  }
}
```

---

## 4. Map API (`/api/v1/maps`)

### Get Coordinates

**Method:** GET
**URL:** `http://localhost:3000/api/v1/maps/get-coordinates?address=1600 Amphitheatre Parkway`

**Headers:**
`Authorization: Bearer <JWT_TOKEN>`

**Response:**

```json
{
  "address": "1600 Amphitheatre Parkway",
  "coordinates": {
    "lat": 37.422,
    "lng": -122.084
  }
}
```

---

### Get Distance and Duration

**Method:** GET
**URL:** `http://localhost:3000/api/v1/maps/get-distance-time?origin=Indore&destination=Bhopal`

**Headers:**
`Authorization: Bearer <JWT_TOKEN>`

**Response:**

```json
{
  "origin": "Indore",
  "destination": "Bhopal",
  "distance": 185603.9,
  "duration": 8520.2
}
```

---

### Get Suggestions (Autocomplete)

**Method:** GET
**URL:** `http://localhost:3000/api/v1/maps/get-suggestions?input=Indo`

**Headers:**
`Authorization: Bearer <JWT_TOKEN>`

**Response:**

```json
{
  "input": "Indo",
  "suggestions": [
    "Indore, Madhya Pradesh, India",
    "Indore Junction, MP, India",
    "Indora, MP, India"
  ]
}
```

---

## Authentication Flow

1. **Register** → User/Captain submits details → Password hashed → JWT issued
2. **Login** → Credentials verified → JWT returned
3. **Protected Routes** → Include `Authorization: Bearer <token>` header
4. **Logout** → JWT blacklisted to prevent reuse

---

## Real-Time Updates with Socket.io

Frontend can subscribe to ride events:

| Event              | Payload     | Description                    |
| ------------------ | ----------- | ------------------------------ |
| `new-ride-request` | Ride object | Notifies nearby captains       |
| `ride-accepted`    | Ride object | Notifies user of acceptance    |
| `ride-started`     | Ride object | Notifies user ride has started |
| `ride-ended`       | Ride object | Notifies user ride has ended   |

Example:

```js
const socket = io("http://localhost:3000");
socket.emit("join", { userId: "<userId>", userType: "user" });

socket.on("ride-accepted", (ride) => {
    console.log("Ride accepted:", ride);
});
```

---

## Error Handling & Validation

* **Global Error Handler:** Centralized in `globalErrorHandler.js`, catches all errors and returns uniform responses.
* **Async Error Wrapper:** `catchAsync.js` wraps async controller functions.
* **Input Validation:** Using `express-validator` to validate user and captain registration.

---

## Token Blacklisting

* JWTs are **invalidated on logout** to prevent reuse.
* Logout saves the token in `BlacklistToken` collection.
* Middleware checks blacklist before granting access to protected routes.

**How It Works:**

1. User logs out → token saved in blacklist
2. Middleware checks token on every protected route
3. If token is blacklisted → **401 Unauthorized**

---

## Summary

* Modular backend with **users, captains, rides, maps**
* Secure authentication with JWT and blacklisting
* Validation and centralized error handling
* Real-time ride updates with Socket.io
* Fully documented endpoints for frontend integration

✅ **Ready for frontend integration**: All APIs are protected where necessary, and Socket.io events handle real-time ride updates.
