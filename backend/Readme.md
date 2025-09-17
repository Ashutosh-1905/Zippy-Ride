Here is the comprehensive `Readme.md` file based on all the documentation you have provided so far, with a clear and logical structure.

-----

# Apex Backend

A Node.js backend for a ride-sharing service, featuring user and captain (driver) authentication. It's built with Express, MongoDB (Mongoose), JWT, and bcrypt, following best practices for a scalable and maintainable application.

-----

## Table of Contents

  - [Project Structure](https://www.google.com/search?q=%23project-structure)
  - [Environment Variables](https://www.google.com/search?q=%23environment-variables)
  - [Installation](https://www.google.com/search?q=%23installation)
  - [Running the Server](https://www.google.com/search?q=%23running-the-server)
  - [API Endpoints](https://www.google.com/search?q=%23api-endpoints)
      - [User API](https://www.google.com/search?q=%23user-api)
      - [Captain API](https://www.google.com/search?q=%23captain-api)
      - [Map API](https://www.google.com/search?q=%23map-api)
      - [Ride API](https://www.google.com/search?q=%23ride-api)

-----

## Project Structure

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

-----

## Environment Variables

Configuration is managed via a `.env` file for security and portability. Copy `.env.example` to `.env` and fill in your values.

| Variable | Description |
| :--- | :--- |
| `SERVER_PORT` | The port the server will run on (e.g., `4000`) |
| `MONGODB_URI` | Your MongoDB connection string |
| `NODE_ENV` | The environment (`development` or `production`) |
| `JWT_SECRET` | A secret key used to sign and verify JWT tokens |
| `MAP_API_KEY` | (Example) An API key for map services |

-----

## Installation

1.  **Clone the repository**:
    ```sh
    git clone <your-repo-url>
    cd <your-repo-name>
    ```
2.  **Install dependencies**:
    ```sh
    npm install
    ```
3.  **Set up environment variables**:
      * Create a `.env` file in the root directory.
      * Add the required variables as listed above.

-----

## Running the Server

  - **Development**: Starts the server with `nodemon` for automatic restarts.
    ```sh
    npm run dev
    ```
  - **Production**: Starts the server in a production environment.
    ```sh
    npm start
    ```

The server will start on the port defined in your `.env` file (`SERVER_PORT`).

-----

## API Endpoints

### **User API** 👨‍💻

All user-related API endpoints are prefixed with `/api/v1/users`.

  * **POST `/register`**
      * **Description:** Registers a new user.
      * **Body:** `{ "firstName": "John", "lastName": "Doe", "email": "johndoe@example.com", "password": "securepassword" }`
  * **POST `/login`**
      * **Description:** Authenticates a user and returns a JWT token.
      * **Body:** `{ "email": "johndoe@example.com", "password": "securepassword" }`
  * **GET `/profile`**
      * **Description:** Retrieves the authenticated user's profile.
      * **Authentication:** Requires a valid `Bearer <token>` in the `Authorization` header.
  * **POST `/logout`**
      * **Description:** Invalidates the user's token.
      * **Authentication:** Requires a valid `Bearer <token>` in the `Authorization` header.

### **Captain API** 👨‍✈️

All captain-related API endpoints are prefixed with `/api/v1/captains`.

  * **POST `/register`**
      * **Description:** Registers a new captain.
      * **Body:** `{ "firstName": "Captain", "lastName": "America", "email": "captain@example.com", "password": "securepassword", "vehicle": { "color": "blue", "plate": "CA-1234", "capacity": 4, "vehicleType": "car" } }`
  * **POST `/login`**
      * **Description:** Authenticates a captain and returns a JWT token.
      * **Body:** `{ "email": "captain@example.com", "password": "securepassword" }`
  * **GET `/profile`**
      * **Description:** Retrieves the authenticated captain's profile.
      * **Authentication:** Requires a valid `Bearer <token>` in the `Authorization` header.
  * **POST `/logout`**
      * **Description:** Invalidates the captain's token.
      * **Authentication:** Requires a valid `Bearer <token>` in the `Authorization` header.

### **Map API** 🗺️

All map-related API endpoints are prefixed with `/api/v1/maps`.

  * **GET `/get-coordinates`**
      * **Description:** Converts a human-readable address to coordinates.
      * **Authentication:** Requires a valid `Bearer <token>` in the `Authorization` header.
      * **Query:** `?address=1600 Amphitheatre Parkway`
  * **GET `/get-distance-time`**
      * **Description:** Calculates the driving distance and estimated time between two locations.
      * **Authentication:** Requires a valid `Bearer <token>` in the `Authorization` header.
      * **Query:** `?origin=123 Main St&destination=456 Side St`
  * **GET `/get-suggestions`**
      * **Description:** Provides auto-complete address suggestions.
      * **Authentication:** Requires a valid `Bearer <token>` in the `Authorization` header.
      * **Query:** `?input=1600 Amphitheatre`

### **Ride API** 🚗

All ride-related API endpoints are prefixed with `/api/v1/rides`.

  * **POST `/request-ride`**
      * **Description:** Allows a user to request a new ride.
      * **Authentication:** Requires a valid **user** `Bearer <token>` in the `Authorization` header.
      * **Body:** `{ "pickup": "123 Main St", "destination": "456 Side St", "vehicleType": "car" }`
  * **GET `/get-fare`**
      * **Description:** Calculates the estimated fare for different vehicle types.
      * **Authentication:** Requires a valid **user** `Bearer <token>` in the `Authorization` header.
      * **Query:** `?pickup=123 Main St&destination=456 Side St`
  * **POST `/accept-ride`**
      * **Description:** Allows a captain to accept a ride request.
      * **Authentication:** Requires a valid **captain** `Bearer <token>` in the `Authorization` header.
      * **Body:** `{ "rideId": "651a238b9d7a2c6d4e5f7a13" }`
  * **GET `/start-ride`**
      * **Description:** Starts an accepted ride after OTP verification.
      * **Authentication:** Requires a valid **captain** `Bearer <token>` in the `Authorization` header.
      * **Query:** `?rideId=651a238b9d7a2c6d4e5f7a13&otp=123456`
  * **POST `/end-ride`**
      * **Description:** Ends an ongoing ride.
      * **Authentication:** Requires a valid **captain** `Bearer <token>` in the `Authorization` header.
      * **Body:** `{ "rideId": "651a238b9d7a2c6d4e5f7a13" }`


      
-------------------------------------------------------------------------------------------------------

# 🔑 Authentication Flow

1. **Register** → User/Captain submits details → Password hashed → JWT issued

2. **Login** → Verify credentials → JWT returned

3. **Access Protected Routes** → Send JWT in Authorization: Bearer <token>

4. **Logout** → Token stored in blacklist → Further use is blocked

## Code Overview

### server.js
- Loads environment variables.
- Imports and starts the Express app.
- Connects to MongoDB using `connectDb.js`.
- Starts the HTTP server.

### src/app.js
- Sets up Express, CORS, and JSON parsing.
- Registers user routes at `/api/v1/users`.
- Root route (`/`) returns a welcome message.

### src/config/config.js
- Loads and freezes configuration from environment variables.

### src/config/connectDb.js
- Connects to MongoDB using Mongoose and the URI from config.

### src/models/User.js
- Defines the `User` schema with fields: firstName, lastName, email, password (hashed), and socketId.
- Password is not selected by default for security.

### src/api/routes/userRoutes.js
- Defines `/register` and `/login` POST endpoints.
- Uses controller functions for logic.

### src/api/controllers/userController.js
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


## Async Error Handling Utility

### What Was Done

- **Created `catchAsync` Utility:**  
  Added `src/utils/catchAsync.js` to simplify error handling in asynchronous route handlers and controllers.  
  This higher-order function wraps async functions and automatically forwards any errors to the global error handler middleware.

  ```js
  const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

  export default catchAsync;
  ```

- **Applied in Controllers:**  
  In `src/api/controllers/authController.js`, all controller functions (`register`, `login`) are wrapped with `catchAsync`.  
  This ensures that any errors thrown in these async functions are caught and passed to the global error handler, avoiding repetitive try-catch blocks.

  ```js
  import catchAsync from "../../utils/catchAsync.js";

  export const register = catchAsync(async (req, res, next) => {
    // ...registration logic...
  });

  export const login = catchAsync(async (req, res, next) => {
    // ...login logic...
  });
  ```

### Why?

- **Cleaner Code:**  
  Removes the need for repetitive try-catch blocks in every async controller.
- **Centralized Error Handling:**  
  Ensures all errors are consistently handled by the global error handler.
- **Maintainability:**  
  Makes controllers easier to read and maintain.

---

**This pattern is a best practice for robust and maintainable Express.js applications using async/await.**



## User Input Validation Middleware

### What Was Done

- **Added User Registration Validation:**  
  Created `src/api/middlewares/validation/userValidation.js` to validate user input during registration using `express-validator`.
  - Checks that `firstName` is not empty.
  - Ensures `email` is a valid email address.
  - Ensures `password` is at least 6 characters long.

  ```js
  import { body, validationResult } from "express-validator";

  export const validateUserRegistration = [
    body("firstName").notEmpty().withMessage("First name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ];
  ```

- **Added Validation Error Handler:**  
  The `handleValidationErrors` middleware checks for validation errors and returns a 400 response with error details if any are found.

  ```js
  export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
  ```

- **Usage:**  
  These middlewares should be used in the registration route to ensure only valid data is processed.

  ```js
  import { validateUserRegistration, handleValidationErrors } from "../middlewares/validation/userValidation.js";

  router.post(
    "/register",
    validateUserRegistration,
    handleValidationErrors,
    registerController
  );
  ```

### Why?

- **Data Integrity:**  
  Prevents invalid or incomplete data from being saved to the database.
- **Security:**  
  Reduces risk of malformed input and potential security vulnerabilities.
- **User Experience:**  
  Provides clear error messages to the client when input is invalid.

---

**This approach ensures robust and secure user input validation for your API endpoints.**


## Validation Middleware for Users and Captains

### What Was Done

- **User Validation:**  
  Added `src/api/middlewares/validation/userValidation.js` to validate user registration input using `express-validator`.  
  Ensures required fields are present and valid before proceeding to controller logic.

  - `validateUserRegistration`: Checks for non-empty first name, valid email, and password length.
  - `handleValidationErrors`: Sends a 400 response with error details if validation fails.

- **Captain Validation:**  
  (If implemented similarly) You can add a similar validation middleware for captain registration, e.g., `captainValidation.js`, to ensure captains provide valid data.

- **Usage Example:**  
  These validation middlewares are used in the registration routes for both users and captains, ensuring only valid data reaches the business logic.

  ```js
  router.post(
    "/register",
    validateUserRegistration,
    handleValidationErrors,
    registerController
  );
  ```

---

## Async Error Handling

- **catchAsync Utility:**  
  Added `src/utils/catchAsync.js` to wrap async controller functions.  
  This automatically forwards errors to the global error handler, removing the need for repetitive try-catch blocks in controllers.

  - Usage in controllers:
    ```js
    export const register = catchAsync(async (req, res, next) => {
      // ...logic...
    });
    ```

---

## Global Error Handler

- **Centralized Error Handling:**  
  Added `src/api/middlewares/globalErrorHandler.js` and integrated it in `src/app.js`.  
  This middleware catches all errors from routes/controllers and sends a consistent error response.  
  In development, it shows the stack trace; in production, it hides sensitive details.

  - Usage in app:
    ```js
    app.use(globalErrorHandler);
    ```

---

## JWT Token Generation

- **generateToken Utility:**  
  Added `src/utils/generateToken.js` to centralize JWT token creation.  
  Used in both user and captain registration/login flows to generate tokens with the user's or captain's ID.

---

## Captain (Driver) Module

- **Model, Service, Controller, and Routes:**  
  Added a complete set of files for captain (driver) registration and login:
  - `src/models/Captain.js`
  - `src/api/services/captainService.js`
  - `src/api/controllers/captainController.js`
  - `src/api/routes/captainRoutes.js`
  - Integrated in `src/app.js` as `/api/v1/captains`

---

## API Structure and Versioning

- **Versioned API Paths:**  
  Updated `src/app.js` to use `/api/v1/users` and `/api/v1/captains` for better organization and future scalability.

- **Welcome Route:**  
  Added a root route (`/`) that returns a welcome message for basic health checks.

---

## Configuration Management

- **Centralized Config:**  
  All environment variables are loaded and frozen in `src/config/config.js` for secure and maintainable configuration management.

---

## Summary

- Added robust validation for user and captain registration.
- Centralized async error handling and global error responses.
- Modularized JWT token generation.
- Separated user and captain logic for clarity and scalability.
- Improved API structure with versioning and a welcome route.
- Centralized configuration for security and maintainability.

---

**These changes make the backend more secure, maintainable, and ready for future features.**

---

# 🔒 Token Blacklisting
**Our application implements a token blacklisting mechanism to ensure that JSON Web Tokens (JWTs) are invalidated immediately upon user logout, thereby preventing their reuse. This enhances security by effectively ending a user's session on demand, even before the token's natural expiration.**

## How It Works
Logout Request: When a user logs out, a POST request is sent to the /api/v1/users/logout endpoint. This request must include the valid JWT in the Authorization header.


## 🔒 Token Blacklisting

Our app uses token blacklisting to instantly invalidate JWTs when a user logs out. This stops a user from using the same token to access secure parts of the application after their session has ended.

---

### How it Works

1.  **Logout**: When you log out, the token from your request is saved in a special `BlacklistToken` database collection. 
2.  **Protection**: Any time a user tries to access a protected route (like their profile), our `authenticateToken` middleware first checks this blacklist.
3.  **Denial**: If the token is found on the blacklist, access is immediately denied with a **401 Unauthorized** error, even if the token isn't expired yet. This ensures that only active, unblacklisted tokens can be used to access your account.

***This proves that even though the token might not have expired, it is no longer valid for authentication, effectively ending the session.***