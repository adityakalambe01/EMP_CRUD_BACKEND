const router = require("express").Router();
const {
	registerUser,
	loginUser,
	logoutUser,
	refreshAccessToken,
	updateUserProfile,
} = require("../controller/index").AuthController;
const { tryCatchMiddleware } = require("../middleware/tryCatch.middleware");
const upload = require("../middleware/upload.middleware")
const { AuthSchema: authSchema } = require("../validations/index");
const { dataValidator } = require("../middleware/data.validator");
const {verifyJWT} = require("../middleware/auth.middleware");

router
	.post(
		"/register",
		dataValidator(authSchema.register),
		tryCatchMiddleware(registerUser)
	)
	.post(
		"/login",
		dataValidator(authSchema.login),
		tryCatchMiddleware(loginUser)
	)
	.post("/logout", tryCatchMiddleware(logoutUser))
	.post("/refresh-token", tryCatchMiddleware(refreshAccessToken))
	.put(
		"/update/profile",
		verifyJWT,
		upload.single("profile"),
		tryCatchMiddleware(updateUserProfile)
	);

module.exports = router;
