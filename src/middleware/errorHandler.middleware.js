exports.errorHandler = (error, request, response, next) => {
	response
		.status(error.statusCode || 500)
		.json({success: false, message: error.message || "Inernal server error" });
};
