# Zippy Ride Backend – Ride Sharing Service

A Node.js backend for a ride-sharing app with **user and captain authentication**, ride management, and real-time updates using **Express, MongoDB, Mongoose, JWT, bcrypt, and Socket.io**.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [Folder Structure](#folder-structure)
3. [Environment Variables](#environment-variables)
4. [Running the Server](#running-the-server)
5. [API Endpoints](#api-endpoints)
   - [Users API](#1-users-api-api-v1-users)
   - [Captains API](#2-captains-api-api-v1-captains)
   - [Map API](#4-map-api-api-v1-maps)
   - [Ride API](#3-ride-api-api-v1-rides)
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
```

### Environment Variables

Create a `.env` file in the root and configure:

| Variable      | Description                                 |
| ------------- | ------------------------------------------- |
| `SERVER_PORT` | Server port (e.g., 3000)                    |
| `MONGODB_URI` | MongoDB connection string                   |
| `NODE_ENV`    | Environment (`development` or `production`) |
| `JWT_SECRET`  | Secret key for JWT signing                  |
| `EMAIL_USER`  | gmail user like ashu@example.com            |
| `EMAIL_PASS`  | gmail Password                              |
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
    │       ├── 📄 emailService.js
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

- `controllers/` → Handle API request logic
- `services/` → Business logic & database interactions
- `middlewares/` → Auth, validation, error handling
- `models/` → Mongoose schemas for Users, Captains, Rides
- `utils/` → Helper functions (JWT generation, async wrapper, socket events)

---

## Running the Server

- **Development:**

```bash
npm run dev
```

- **Production:**

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
  "email": "ashutoshdhakad7222@gmail.com",
  "password": "12345678"
}
```

**Response:**

```json
{
    "message": "User registered successfully",
    "user": {
        "id": "68e7bfdf8da1cc643dc652d0",
        "fullName": "Ashu Dhakad",
        "email": "ashutoshdhakad7222@gmail.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTdiZmRmOGRhMWNjNjQzZGM2NTJkMCIsImlhdCI6MTc2MDAxODQwMCwiZXhwIjoxNzYwNjIzMjAwfQ.gYYBtBk1FO2j4W73g9zvKzEOJWvuV-HNjWNYcdxqVHA"
}
```

---

### Login User

**Method:** POST
**URL:** `http://localhost:3000/api/v1/users/login`

**Body:**

```json
   {
   "email":"ashutoshdhakad7222@gmail.com",
    "password":"12345678"
   }
```

**Response:**

```json
{
    "message": "Logged in successfully",
    "user": {
        "id": "68e7bfdf8da1cc643dc652d0",
        "fullName": "Ashu Dhakad",
        "email": "ashutoshdhakad7222@gmail.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTdiZmRmOGRhMWNjNjQzZGM2NTJkMCIsImlhdCI6MTc2MDAxODczMSwiZXhwIjoxNzYwNjIzNTMxfQ.4Y8l0AD6KKIDmcXyKTZPVP-qbvMPOe4EBBMQYC3207Y"
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
    "status": "success",
    "data": {
        "user": {
            "fullname": {
                "firstName": "Ashu",
                "lastName": "Dhakad"
            },
            "_id": "68e7bfdf8da1cc643dc652d0",
            "email": "ashutoshdhakad7222@gmail.com",
            "createdAt": "2025-10-09T13:59:59.987Z",
            "updatedAt": "2025-10-09T13:59:59.987Z",
            "__v": 0
        }
    }
}
```

---

### Logout User

**Method:** POST
**URL:** `http://localhost:3000/api/v1/users/logout`

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
    "id": "68d80d18013d5c6aae416b0a",
    "fullName": {
      "firstName": "Ramesh",
      "lastName": "Sharma"
    },
    "email": "ramesh@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDgwZDE4MDEzZDVjNmFhZTQxNmIwYSIsImlhdCI6MTc1ODk4OTU5MiwiZXhwIjoxNzU5NTk0MzkyfQ.dRD3xbMGXpGJlY7JMkLlErPmh9dhRaBqaYaiB7nVYXA"
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
  "message": "Logged in successfully",
  "captain": {
    "id": "68d80d18013d5c6aae416b0a",
    "fullName": {
      "firstName": "Ramesh",
      "lastName": "Sharma"
    },
    "email": "ramesh@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDgwZDE4MDEzZDVjNmFhZTQxNmIwYSIsImlhdCI6MTc1ODk4OTcxMiwiZXhwIjoxNzU5NTk0NTEyfQ.hoNNDxtaCnEjgECVTxo60Z7lV4wWcC9YYD_yk-2LtUk"
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
    "status": "success",
    "data": {
        "captain": {
            "fullname": {
                "firstName": "Ramesh",
                "lastName": "Sharma"
            },
            "_id": "68d80d18013d5c6aae416b0a",
            "email": "ramesh@example.com",
            "status": "inactive",
            "vehicle": {
                "color": "Red",
                "plate": "MH12AB1234",
                "capacity": 4,
                "vehicleType": "car",
                "_id": "68d80d18013d5c6aae416b0b"
            },
            "createdAt": "2025-09-27T16:13:12.792Z",
            "updatedAt": "2025-09-27T16:13:12.792Z",
            "__v": 0
        }
    }
}


```

---

### Logout Captain

**Method:** POST
**URL:** `http://localhost:3000/api/v1/captains/logout`

**Response:**

```json
{
  "message": "Captain logged out successfully"
}
```

---

## 3. Map API (`/api/v1/maps`)

### Get Coordinates

**Method:** GET
**URL:** `http://localhost:3000/maps/get-coordinates?address=bhopal madhya pradesh`

**Headers:**
`Authorization: Bearer <JWT_TOKEN>`

**Response:**

```json
{
    "status": "success",
    "data": {
        "lat": 23.2584857,
        "lon": 77.401989,
        "displayName": "Bhopal, Huzur Tahsil, Bhopal, Madhya Pradesh, 462001, India"
    }
}
```

---

### Get Distance and Duration

**Method:** GET
**URL:** `http://localhost:3000/api/v1/maps/get-distance-time?origin=bhopal&destination=indore`

**Response:**

```json
{
    "status": "success",
    "data": {
        "status": "OK",
        "distance": {
            "text": "185.95 km",
            "value": 185954.2
        },
        "duration": {
            "text": "2 hours 21 mins",
            "value": 8499.2
        }
    }
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
## 4. Ride API (`/api/v1/rides`)

### Request a Ride

**Method:** POST
**URL:** `http://localhost:3000/api/v1/rides/request-ride`

**Headers:**
`Authorization: Bearer <USER_JWT_TOKEN>`

**Body:**

```json
{
    "pickup": "Bhopal",
    "destination": "Indore",
    "vehicleType": "car" 
}
```

**Response:**

```json
{
    "message": "Ride requested successfully. Captains nearby have been notified to accept your request.",
    "ride": {
        "user": {
            "fullname": {
                "firstName": "Ashu",
                "lastName": "Dhakad"
            },
            "_id": "68e7bfdf8da1cc643dc652d0",
            "email": "ashutoshdhakad7222@gmail.com",
            "createdAt": "2025-10-09T13:59:59.987Z",
            "updatedAt": "2025-10-09T13:59:59.987Z",
            "__v": 0
        },
        "pickup": "Bhopal",
        "destination": "Indore",
        "fare": 2706,
        "status": "pending",
        "duration": 8499.2,
        "distance": 185954.2,
        "_id": "68e86a22ee6e7dda68f6ac49",
        "createdAt": "2025-10-10T02:06:26.138Z",
        "updatedAt": "2025-10-10T02:06:26.138Z",
        "__v": 0
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
        "car": 2706,
        "motorcycle": 1348,
        "auto": 1987
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
  "rideId": "68e86a22ee6e7dda68f6ac49"
}

```

**Response:**

```json
{
    "message": "Ride accepted successfully.",
    "ride": {
        "_id": "68e86a22ee6e7dda68f6ac49",
        "user": {
            "fullname": {
                "firstName": "Ashu",
                "lastName": "Dhakad"
            },
            "_id": "68e7bfdf8da1cc643dc652d0",
            "email": "ashutoshdhakad7222@gmail.com",
            "createdAt": "2025-10-09T13:59:59.987Z",
            "updatedAt": "2025-10-09T13:59:59.987Z",
            "__v": 0
        },
        "pickup": "Bhopal",
        "destination": "Indore",
        "fare": 2706,
        "status": "accepted",
        "duration": 8499.2,
        "distance": 185954.2,
        "createdAt": "2025-10-10T02:06:26.138Z",
        "updatedAt": "2025-10-10T02:11:24.517Z",
        "__v": 0,
        "captain": {
            "fullname": {
                "firstName": "Ramesh",
                "lastName": "Sharma"
            },
            "vehicle": {
                "color": "Red",
                "plate": "MH12AB1234",
                "capacity": 4,
                "vehicleType": "car"
            },
            "currentLocation": {
                "type": "Point",
                "coordinates": [
                    77.4126,
                    23.2599
                ]
            },
            "_id": "68e7c42fa044f5433c9cd91f",
            "email": "ramesh@example.com",
            "status": "inactive",
            "createdAt": "2025-10-09T14:18:23.246Z",
            "updatedAt": "2025-10-09T14:18:23.246Z",
            "__v": 0
        },
        "otp": "573089"
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
 "rideId": "68e86a22ee6e7dda68f6ac49",
  "otp": "573089"
}
```

**Response:**

```json
{
    "message": "Ride started successfully.",
    "ride": {
        "_id": "68e86a22ee6e7dda68f6ac49",
        "user": {
            "fullname": {
                "firstName": "Ashu",
                "lastName": "Dhakad"
            },
            "_id": "68e7bfdf8da1cc643dc652d0",
            "email": "ashutoshdhakad7222@gmail.com",
            "createdAt": "2025-10-09T13:59:59.987Z",
            "updatedAt": "2025-10-09T13:59:59.987Z",
            "__v": 0
        },
        "pickup": "Bhopal",
        "destination": "Indore",
        "fare": 2706,
        "status": "ongoing",
        "duration": 8499.2,
        "distance": 185954.2,
        "createdAt": "2025-10-10T02:06:26.138Z",
        "updatedAt": "2025-10-10T02:15:43.167Z",
        "__v": 0,
        "captain": {
            "fullname": {
                "firstName": "Ramesh",
                "lastName": "Sharma"
            },
            "vehicle": {
                "color": "Red",
                "plate": "MH12AB1234",
                "capacity": 4,
                "vehicleType": "car"
            },
            "currentLocation": {
                "type": "Point",
                "coordinates": [
                    77.4126,
                    23.2599
                ]
            },
            "_id": "68e7c42fa044f5433c9cd91f",
            "email": "ramesh@example.com",
            "status": "inactive",
            "createdAt": "2025-10-09T14:18:23.246Z",
            "updatedAt": "2025-10-09T14:18:23.246Z",
            "__v": 0
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
    "rideId": "68e86a22ee6e7dda68f6ac49"
}
```

**Response:**

```json
{
    "message": "Ride ended successfully.",
    "ride": {
        "_id": "68e86a22ee6e7dda68f6ac49",
        "user": {
            "fullname": {
                "firstName": "Ashu",
                "lastName": "Dhakad"
            },
            "_id": "68e7bfdf8da1cc643dc652d0",
            "email": "ashutoshdhakad7222@gmail.com",
            "createdAt": "2025-10-09T13:59:59.987Z",
            "updatedAt": "2025-10-09T13:59:59.987Z",
            "__v": 0
        },
        "pickup": "Bhopal",
        "destination": "Indore",
        "fare": 2706,
        "status": "completed",
        "duration": 8499.2,
        "distance": 185954.2,
        "createdAt": "2025-10-10T02:06:26.138Z",
        "updatedAt": "2025-10-10T02:17:46.959Z",
        "__v": 0,
        "captain": {
            "fullname": {
                "firstName": "Ramesh",
                "lastName": "Sharma"
            },
            "vehicle": {
                "color": "Red",
                "plate": "MH12AB1234",
                "capacity": 4,
                "vehicleType": "car"
            },
            "currentLocation": {
                "type": "Point",
                "coordinates": [
                    77.4126,
                    23.2599
                ]
            },
            "_id": "68e7c42fa044f5433c9cd91f",
            "email": "ramesh@example.com",
            "status": "inactive",
            "createdAt": "2025-10-09T14:18:23.246Z",
            "updatedAt": "2025-10-09T14:18:23.246Z",
            "__v": 0
        }
    }
}
```

---

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

- **Global Error Handler:** Centralized in `globalErrorHandler.js`, catches all errors and returns uniform responses.
- **Async Error Wrapper:** `catchAsync.js` wraps async controller functions.
- **Input Validation:** Using `express-validator` to validate user and captain registration.

---

## Token Blacklisting

- JWTs are **invalidated on logout** to prevent reuse.
- Logout saves the token in `BlacklistToken` collection.
- Middleware checks blacklist before granting access to protected routes.

**How It Works:**

1. User logs out → token saved in blacklist
2. Middleware checks token on every protected route
3. If token is blacklisted → **401 Unauthorized**

---

## Summary

- Modular backend with **users, captains, rides, maps**
- Secure authentication with JWT and blacklisting
- Validation and centralized error handling
- Real-time ride updates with Socket.io
- Fully documented endpoints for frontend integration

✅ **Ready for frontend integration**: All APIs are protected where necessary, and Socket.io events handle real-time ride updates.
