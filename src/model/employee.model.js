const { Schema, model, default: mongoose } = require("mongoose");
const { employeeConstant } = require("../constant/index");
const { required } = require("joi");
const employeeSchema = new Schema(
	{
		name: {
			type: String,
			minLength: 3,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
			match: [
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
				"Invalid email format",
			],
			required: true,
		},
		gender: {
			type: String,
			enum: employeeConstant.genderEnum.options,
			default: employeeConstant.genderEnum.default,
		},
		department: {
			type: String,
			enum: employeeConstant.departmentEnum.options,
			default: employeeConstant.departmentEnum.default,
		},
		salary: {
			type: Number,
			default: 20000,
		},
		position: {
			type: String,
			enum: employeeConstant.positionEnum.options,
			default: employeeConstant.positionEnum.default,
		},
		addedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

employeeSchema.statics.newEmployee = async function (addedBy, newEmployee) {
	return await this.create({ ...newEmployee, addedBy: addedBy });
};

employeeSchema.statics.getAllEmployees = async function (
	filter,
	pagination,
	sort,
	projection
) {
	
	const totalEmployees = await this.countDocuments(filter);
	return {
		employees: await this.find(filter)
			.select(projection)
			.skip(pagination.skip)
			.limit(pagination.pageSize)
			.sort(sort),
		totalEmployees: totalEmployees,
		totalPages: Math.ceil(totalEmployees / pagination.pageSize),
		currentPage: parseInt(pagination.currentPage),
		pageSize: parseInt(pagination.pageSize),
	};
};

employeeSchema.statics.employeeById = async function (addedBy, employeeId) {
	return await this.findOne({ _id: employeeId, addedBy: addedBy }).select(
		"-addedBy -createdAt -updatedAt"
	);
};

employeeSchema.statics.deleteEmployeeById = async function (
	addedBy,
	employeeId
) {
	return await this.findOneAndDelete({
		_id: employeeId,
		addedBy: addedBy,
	}).select("-addedBy");
};

employeeSchema.statics.updateEmployee = async function (
	addedBy,
	employeeId,
	updatedEmployee
) {
	return await this.findOneAndUpdate(
		{ _id: employeeId, addedBy: addedBy },
		updatedEmployee,
		{
			new: true,
		}
	).select("-addedBy");
};
module.exports = model("Employee", employeeSchema);
