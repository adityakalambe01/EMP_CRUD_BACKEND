const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { connectDB, disconnectDB } = require("./db/connection");
const app = express();

//Routes Import
const { EmployeeRoutes, AuthRoutes } = require("./routes/index");

// Middleware Imports
const { errorHandler } = require("./middleware/errorHandler.middleware");
const { verifyJWT } = require("./middleware/auth.middleware");


//Middlewares
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/auth", AuthRoutes);
app.use("/employee", verifyJWT, EmployeeRoutes);

// Error handlers
app.use(errorHandler);

module.exports = { app, connectDB, disconnectDB };
