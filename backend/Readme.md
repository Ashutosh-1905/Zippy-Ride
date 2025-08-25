# Uber Backend

A Node.js backend for user authentication using Express, MongoDB (Mongoose), JWT, and bcrypt.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Code Overview](#code-overview)
- [How Authentication Works](#how-authentication-works)
- [Extending the Project](#extending-the-project)
- [JWT Token Generation and DRY Improvements](#jwt-token-generation-and-dry-improvements)
- [Configuration Management](#configuration-management)
- [Captain (Driver) Module](#captain-driver-module)
- [Summary of Changes](#summary-of-changes)

---

## Project Structure

```
.
├── .env
├── .env.example
├── .gitignore
├── package.json
├── Readme.md
├── server.js
└── src
    ├── app.js
    ├── api
    │   ├── controllers
    │   │   └── authController.js
    │   ├── middlewares
    │   │   └── authMiddleware.js
    │   └── routes
    │       └── authRoutes.js
    ├── config
    │   ├── config.js
    │   └── connectDb.js
    └── models
        ├── Captain.js
        └── User.js
```

---

## Environment Variables

Configuration is managed via environment variables.  
Copy `.env.example` to `.env` and fill in your values:

| Variable        | Description                        |
|-----------------|------------------------------------|
| SERVER_PORT     | Port for the server (e.g., 3000)   |
| MONGODB_URI     | MongoDB connection string          |
| NODE_ENV        | Environment (development/production)|
| FRONTEND_URL    | (Optional) Frontend URL            |
| JWT_SECRET      | Secret key for JWT signing         |

---

## Installation

1. **Clone the repository**
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Set up environment variables**
   - Copy `.env.example` to `.env` and update values.

---

## Running the Server

- **Development:**
  ```sh
  npm run dev
  ```
- **Production:**
  ```sh
  npm start
  ```

Server will start on the port defined in `.env` (`SERVER_PORT`).

---

## API Endpoints

### Auth Routes (`/api/auth`)

- **POST `/register`**  
  Register a new user.  
  **Body:**  
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```

- **POST `/login`**  
  Login with email and password.  
  **Body:**  
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```

**Responses:**  
Both endpoints return a JWT token and user info on success.

---

## Code Overview

### server.js
- Loads environment variables.
- Imports and starts the Express app.
- Connects to MongoDB using `connectDb.js`.
- Starts the HTTP server.

### src/app.js
- Sets up Express, CORS, and JSON parsing.
- Registers auth routes at `/api/auth`.
- Root route (`/`) returns a welcome message.

### src/config/config.js
- Loads and freezes configuration from environment variables.

### src/config/connectDb.js
- Connects to MongoDB using Mongoose and the URI from config.

### src/models/User.js
- Defines the `User` schema with fields: firstName, lastName, email, password (hashed), and socketId.
- Password is not selected by default for security.

### src/api/routes/authRoutes.js
- Defines `/register` and `/login` POST endpoints.
- Uses controller functions for logic.

### src/api/controllers/authController.js
- **register:**  
  - Checks if user exists.
  - Hashes password with bcrypt.
  - Saves new user to DB.
  - Returns JWT token and user info.
- **login:**  
  - Finds user by email.
  - Compares password with bcrypt.
  - Returns JWT token and user info.

### src/api/middlewares/authMiddleware.js
- Middleware to verify JWT tokens in the `Authorization` header.
- Attaches decoded user info to `req.user`.

---

## How Authentication Works

1. **Register:**  
   - User submits registration data.
   - Password is hashed and user is saved.
   - JWT token is generated and returned.

2. **Login:**  
   - User submits email and password.
   - Password is compared with hash in DB.
   - If valid, JWT token is generated and returned.

3. **JWT Middleware:**  
   - For protected routes, the middleware checks for a valid JWT in the `Authorization` header.

---

## Extending the Project

- Add new models in `src/models/`.
- Add new routes/controllers in `src/api/routes/` and `src/api/controllers/`.
- Use the JWT middleware to protect new endpoints.
- Update `.env.example` if new environment variables are needed.

---

## JWT Token Generation and DRY Improvements

### What Was Done

- **Centralized JWT Token Creation:**  
  A utility function `generateToken` was created in `src/utils/generateToken.js` to handle JWT token generation. This function takes a user’s MongoDB `_id` and signs it with the secret from your config, setting an expiry of 1 hour.

  ```js
  import jwt from "jsonwebtoken";
  import config from "../config/config.js";

  const generateToken = (id) => {
      return jwt.sign({ id }, config.jwtSecret, { expiresIn: "1h" });
  };

  export default generateToken;
  ```

- **Applied DRY Principle in Auth Logic:**  
  In both registration and login flows (`src/api/services/userService.js`), the `generateToken` utility is used to create the JWT token, always passing the correct user ID (`newUser._id` or `user._id`).  
  This avoids code duplication and ensures consistent token creation.

  ```js
  // Register User
  const token = generateToken(newUser._id);

  // Login User
  const token = generateToken(user._id);
  ```

- **Controller Usage:**  
  The controllers (`src/api/controllers/authController.js`) simply receive the token and user object from the service and return them in the API response.

### Why This Matters

- **Security:**  
  Ensures that only the user’s unique ID is included in the JWT payload, signed securely.
- **Maintainability:**  
  Any changes to token logic (expiry, payload, etc.) can be made in one place (`generateToken.js`).
- **Clarity:**  
  Keeps controller and service code clean and focused on business logic, not token mechanics.

### Summary

- JWT token generation is handled in a single utility function.
- All authentication flows use this function, passing the correct user ID.
- The code is DRY, secure, and easy to maintain.

---

## Configuration Management

### What Was Done

- **Centralized Configuration:**  
  The file `src/config/config.js` was created to manage all environment-based configuration for the backend.  
  It loads environment variables using `dotenv` and exposes them as a frozen config object, making them accessible throughout the project.

  ```js
  import { config as conf } from "dotenv";
  conf();

  const _config = {
      port: process.env.SERVER_PORT,
      databaseUrl: process.env.MONGODB_URI,
      env: process.env.NODE_ENV,
      frontendUrl: process.env.FRONTEND_URL,
      jwtSecret: process.env.JWT_SECRET
  };

  const config = Object.freeze(_config);

  export default config;
  ```

#### Why?

- **Security:**  
  Sensitive values (like database URI and JWT secret) are not hardcoded, but loaded from environment variables.
- **Maintainability:**  
  All configuration is managed in one place, making it easy to update or extend.
- **Best Practices:**  
  Using `Object.freeze` ensures configuration values cannot be changed at runtime, preventing accidental mutations.

---

## Captain (Driver) Module

### What Was Done

- **Captain Model:**  
  Added `src/models/Captain.js` to define the schema for captains (drivers), including personal info, vehicle details, status, and location.
- **Captain Service:**  
  Added `src/api/services/captainService.js` for business logic to register and login captains, including password hashing and credential checks.
- **Captain Controller:**  
  Added `src/api/controllers/captainController.js` to handle HTTP requests for captain registration and login.
- **Captain Routes:**  
  Added `src/api/routes/captainRoutes.js` to define `/register` and `/login` endpoints for captains.
- **App Integration:**  
  Updated `src/app.js` to use `/api/v1/captains` route for captain-related endpoints.

#### Why?

- **Separation of Concerns:**  
  Keeps captain (driver) logic separate from user (rider) logic for clarity and scalability.
- **Extensibility:**  
  Makes it easy to add more features for captains (like trip management, location updates, etc.) in the future.
- **Security:**  
  Ensures captain passwords are hashed and credentials are validated securely.

---

## Global Error Handler Middleware

### What Was Done

- **Added Centralized Error Handling:**  
  Implemented a global error handler middleware in `src/api/middlewares/globalErrorHandler.js`.  
  This middleware catches errors from all routes and controllers, and sends a consistent error response to the client.

  ```js
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
  ```

- **Integrated in Express App:**  
  In `src/app.js`, the middleware is added at the end of all routes:
  ```js
  app.use(globalErrorHandler);
  ```

### Why?

- **Consistency:**  
  Ensures all errors are handled in one place and responses have a uniform structure.
- **Security:**  
  Hides sensitive error stack traces in production, but shows them in development for easier debugging.
- **Maintainability:**  
  Makes it easy to manage and update error handling logic in a single file.

---

**This approach improves reliability, security, and developer experience**

## Summary of Changes

- Centralized all configuration in one file for security and maintainability.
- Added a complete Captain (driver) module with model, service, controller, and routes.
- Integrated captain routes into the main app.
- Followed best practices for code organization, DRY principles, and