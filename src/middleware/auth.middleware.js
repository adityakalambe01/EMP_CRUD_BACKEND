
const jwt = require("jsonwebtoken")
const { UserSchema: User } = require("../model/index");
require("dotenv").config();

exports.verifyJWT = async (request, response, next) => {
	try {
		const token =
			request.cookies?.accessToken ||
			request.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			const error = new Error("Access token not found")
			error.statusCode = 404;
			throw error;
		}

		const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		
		const user = await User.findById(decodedToken?._id).select(
			"-password -refreshToken"
		);

		if (!user) {
			const error = new Error("User not found");
			error.statusCode = 404;
			throw error;
			// throw new ApiError(401, "Invalid Access Token");
		}

		request.user = user._id;
		next();
	} catch (error) {
		response.status(401).json({ message: "Invalid access token" });
	}
};
