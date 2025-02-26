const {AuthService: authServ} = require('../service/index');
exports.registerUser = async(request, response)=>{
    const createdUser = await authServ.registerUser(request.body);
    response.status(201).json({success: true, createdUser});
}

exports.loginUser = async(request, response)=>{
    const {user, accessToken, refreshToken, options} = await authServ.loginUser(request.body);
    response
		.status(200)
		.cookie("accessToken", accessToken, options)
		.cookie("refreshToken", refreshToken, options)
		.cookie("user", encodeURIComponent(JSON.stringify(user)), options)
		.json({ success: true, message: "Login Success!" });
}

const jwt = require('jsonwebtoken')
exports.logoutUser = async(request, response)=>{
	const decodedUser = jwt.decode(
		request.cookies?.accessToken,
		process.env.ACCESS_TOKEN_SECRET
	);
	
    const { user, options } = await authServ.logoutUser(decodedUser);
    response
		.status(200)
		.clearCookie("accessToken", options)
		.clearCookie("refreshToken", options)
		.clearCookie("user", options)
		.json({ success: true, message: "Logout Success!" });
}

exports.refreshAccessToken = async(request, response)=>{
    const { accessToken, refreshToken, options } =
		await authServ.refreshAccessToken(
			request.body.refreshToken || request.cookies.refreshToken
		);
    response
		.status(200)
		.cookie("accessToken", accessToken, options)
		.json({ success: true, message: "Access token refreshed",  });
}

exports.updateUserProfile = async(request, response)=>{	
	
	const file = request.file;
	
	
	const { updatedUser, options } = await authServ.updateProfile(
		request.user._id,
		{ ...request.body, profile: file? file.path :''}
	);
	
	response
		.status(200)
		.cookie(
			"user",
			encodeURIComponent(JSON.stringify(updatedUser)),
			options
		)
		.json({
			message: "User profile updated successfully",
		});

}