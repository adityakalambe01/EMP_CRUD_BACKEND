const bcrypt = require("bcrypt");
const { UserSchema: User } = require("../model/index");
const jwt = require("jsonwebtoken");
const options = {
	httpOnly: false,
	secure: true,
	sameSite: "none",
	path: "/",
	maxAge: 1000 * 60 * 60 * 24 * 7,
};
const generateAccessAndRefereshTokens = async (userId) => {
	try {
		const user = await User.findById(userId);
		const accessToken = await user.generateAccessToken();
		const refreshToken = await user.generateRefreshToken();

		user.refreshToken = refreshToken;
		await user.save({ validateBeforeSave: false });

		return { accessToken, refreshToken };
	} catch (error) {
		const err = new Error(
			"Something went wrong while generating referesh and access token"
		);
		err.statusCode = 500;
		throw err;
	}
};

exports.registerUser = async (body) => {
	const { name, email, password } = body;

	const existedUser = await User.findOne({ email: email });

	if (existedUser) {
		const error = new Error("User with email exists");
		error.statusCode = 409;
		throw error;
	}

	const user = await User.create({
		name: name,
		email: email,
		password: password,
	});

	const createdUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);

	if (!createdUser) {
		const error = new Error(
			"Something went wrong while registering the user"
		);
		error.statusCode = 500;
		throw error;
	}

	return createdUser;
};

exports.loginUser = async (body) => {
	const { email, password } = body;

	const user = await User.findOne({
		email: email,
	});

	if (!user) {
		const error = new Error("User does not exist");
		error.statusCode = 404;
		throw error;
	}

	const isPasswordValid = await user.isPasswordCorrect(password);

	if (!isPasswordValid) {
		const error = new Error("Invalid user credentials");
		error.statusCode = 401;
		throw error;
	}

	const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
		user._id
	);

	const loggedInUser = await User.findById(user._id).select(
		"-password -refreshToken -_id -updatedAt -createdAt"
	);

	return { user: loggedInUser, accessToken, refreshToken, options };
};

exports.logoutUser = async (user) => {
	const dbUser = await User.findByIdAndUpdate(
		user._id,
		{
			$unset: {
				refreshToken: 1,
			},
		},
		{
			new: true,
		}
	);

	if (!dbUser) {
		const error = new Error("User not found");
		error.statusCode = 404;
		throw error;
	}

	return { dbUser, options };
};

exports.refreshAccessToken = async (refreshToken) => {
	const incomingRefreshToken = refreshToken;

	if (!incomingRefreshToken) {
		const error = new Error("unauthorized request");
		error.statusCode = 404;
		throw error;
	}
	const decodedToken = jwt.verify(
		incomingRefreshToken,
		process.env.REFRESH_TOKEN_SECRET
	);

	const user = await User.findById(decodedToken?._id);

	if (!user) {
		const error = new Error("User not found");
		error.statusCode = 404;
		throw error;
	}

	if (incomingRefreshToken !== user?.refreshToken) {
		const error = new Error("Refresh token is expired or used");
		error.statusCode = 400;
		throw error;
	}

	const accessToken = await user.generateAccessToken();

	return {
		accessToken: accessToken,
		refreshToken: incomingRefreshToken,
		options: options,
	};
};

exports.updateProfile = async (_id, user) => {	
	const update = {};
	if (user.profile) {
		update.profile = user.profile;
	}
	if (user.name) {
		update.name = user.name;
	}
	if (user.email) {
		update.email = user.email;
	}
	if (user.password) {
		update.password = await bcrypt.hash(user.password, 10);
	}
	
	const updatedUser = await User.findOneAndUpdate(_id, update, {
		new: true,
	}).select("-_id -createdAt -updatedAt -password -refreshToken");
		
	return {
		updatedUser: updatedUser,
		options: options,
	};
};
