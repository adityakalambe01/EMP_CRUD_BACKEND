const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {Schema, model} = require("mongoose");
require("dotenv").config();
const userSchema = new Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowecase: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		profile:{
			type:String,
			default: "https://imgs.search.brave.com/z9nFXFrCbkMcO5rOpF4QW-mv_EkoDwJyVQylnHDvly8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAyMC8x/MC8xMS8xOS81MS9j/YXQtNTY0Njg4OV82/NDAuanBn"
		},
		password: {
			type: String,
			required: true,
		},
		refreshToken: {
			type: String,
		},
	},
	{
		timestamps: true,
        versionKey: false
	}
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 10);
	next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		}
	);
};
userSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		}
	);
};

module.exports = model("User", userSchema);
