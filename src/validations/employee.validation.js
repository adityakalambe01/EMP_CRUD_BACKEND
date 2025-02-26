const JOI = require("joi");

const { nameSchema, emailSchema, genderSchema, departmentSchema, salarySchema, positionSchema, addedBySchema } = require("./sharedSchema");


const EmployeeSchema = {
	//New Employee
	newEmployee: JOI.object({
		name: nameSchema,
		email: emailSchema,
		gender: genderSchema,
		department: departmentSchema,
		salary: salarySchema,
		position: positionSchema,
		addedBy: addedBySchema,
	}),
	updateEmployee: JOI.object({
		name: nameSchema,
		email: emailSchema,
		gender: genderSchema,
		department: departmentSchema,
		salary: salarySchema,
		position: positionSchema,
		addedBy: addedBySchema,
	}),
};

module.exports = EmployeeSchema;
