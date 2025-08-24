
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
        ├── Capton.js
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

## JWT Token Generation and Usage

### What is Happening?

- **`src/utils/generateToken.js`**  
  This file exports a function that creates a JWT token using the user's MongoDB `_id` as payload.  
  It uses the secret from your config and sets the token to expire in 1 hour.

  ```js
  import jwt from "jsonwebtoken";
  import config from "../config/config.js";

  const generateToken = (id) => {
      return jwt.sign({ id }, config.jwtSecret, { expiresIn: "1h" });
  };

  export default generateToken;
  ```

- **`src/api/controllers/authController.js`**  
  - **Register:**  
    - Receives user data, checks if the user exists, hashes the password, saves the user, and generates a JWT token using `generateToken(newUser._id)`.
    - **Correction:** The code should use `newUser._id` instead of `user._id` when calling `generateToken` after registration.
  - **Login:**  
    - Checks credentials, compares password, and generates a JWT token using `generateToken(user._id)`.
    - **Correction:** The code should pass `user._id` to `generateToken` instead of calling it with no arguments.

### DRY (Don't Repeat Yourself) Improvements

- Always use the `generateToken` utility for token creation.
- Pass the correct user ID (`newUser._id` or `user._id`) to `generateToken`.
- Remove commented-out or duplicate JWT code for clarity.

### What to Change in Your Code

**In `authController.js`, update the following:**

```javascript
// filepath: e:\projects\Uber\backend\src\api\controllers\authController.js
// ...existing code...

// In register:
const token = generateToken(newUser._id);

// In login:
const token = generateToken(user._id);

// ...existing code...
```

**Remove any unused or commented-out JWT code to keep things clean.**

---

## Summary

- JWT tokens are generated in a single utility function for both registration and login.
- Always pass the user's `_id` to `generateToken` for correct payload.
- This keeps your code DRY, secure, and easy to maintain.

---