const JOI = require("joi");
const mongoose = require("mongoose");
const { genderEnum, departmentEnum, positionEnum } =
	require("../constant/index").employeeConstant;

const passwordSchema = JOI.string()
	.min(8)
	.pattern(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
	)
	.required()
	.messages({
		"string.min": "Password must be at least 8 characters long",
		"string.pattern.base":
			"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
		"any.required": "Password is a required field",
	});

const nameSchema = JOI.string()
	.min(3)
	.pattern(/^([A-Z][a-z]+)(\s[A-Z][a-z]+)*$/)
	.required()
	.messages({
		"string.empty": "Name is required",
		"string.min": "Name must be at least 3 characters long",
		"string.pattern.base": "Name must only contain letters and space",
		"any.required": "Name is a required field",
	});
const emailSchema = JOI.string().email().required().messages({
	"string.empty": "Email is required",
	"string.email": "Invalid email format",
	"string.pattern.base": "Invalid email format",
	"any.required": "Email is a required field",
});

const genderSchema = JOI.string()
	.required()
	.default(genderEnum.default)
	.valid(...genderEnum.options, "")
	.messages({
		"any.only": `Gender must be one of the following values: ${genderEnum.options.join(
			", "
		)}.`,
		"string.base": "Gender must be a string.",
		"any.required": "Gender is required.",
		"string.empty": "Gender cannot be empty.",
		"any.default": `Default gender is set to "${genderEnum.default}".`,
	});
const departmentSchema = JOI.string()
	.valid(...departmentEnum.options, "")
	.default(departmentEnum.default)
	.required()
	.messages({
		"any.only": `Department must be one of the following values: ${departmentEnum.options.join(
			", "
		)}.`,
		"string.base": "Department must be a string.",
		"any.required": "Department is required.",
		"string.empty": "Department cannot be empty.",
		"any.default": `Default department is set to "${departmentEnum.default}".`,
	});
const salarySchema = JOI.number().optional().default(20000).messages({
	"number.base": "Salary is required.",
	"number.default": "Salary is not provided, defaulting to 20000",
});


const positionSchema = JOI.string()
	.required()
	.default(positionEnum.default)
	.valid(...positionEnum.options, "")
	.messages({
		"any.only": `Position must be one of the following values: ${positionEnum.options.join(
			", "
		)}.`,
		"string.base": "Position must be a string.",
		"any.required": "Position is required.",
		"string.empty": "Position cannot be empty.",
		"any.default": `Default position is set to "${positionEnum.default}".`,
	});


const addedBySchema = JOI.string()
	.custom((value, helpers) => {
		if (!mongoose.Types.ObjectId.isValid(value)) {
			return helpers.error("any.optional");
		}
		return value;
	}, "MongoDB ObjectId Validation")
	.optional()
	.messages({
		"string.custom": "Invalid addedBy value",
		"any.optional": "AddedBy is optional",
		"any.allowOnly": "AddedBy must be a valid MongoDB ObjectId.",
	});


module.exports = {
	passwordSchema,
	emailSchema,
	nameSchema,
	genderSchema,
	departmentSchema,
	salarySchema,
	positionSchema,
	addedBySchema,
};
