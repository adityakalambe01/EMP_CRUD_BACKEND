const JOI = require("joi");

const { emailSchema, passwordSchema, nameSchema } = require("./sharedSchema");

const authSchema = {
	login: JOI.object({
		email: emailSchema,
		password: passwordSchema,
	}),

	register: JOI.object({
		name: nameSchema,
		email: emailSchema,
		password: passwordSchema,
	}),
};

module.exports = authSchema;
