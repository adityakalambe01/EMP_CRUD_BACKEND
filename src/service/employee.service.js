const { employeeConstant } = require("../constant");
const { EmployeeSchema: employeeSchema } = require("../model/index");

exports.newEmployee = async (addedBy, employeeData) => {
	if (
		await employeeSchema.findOne({
			email: employeeData.email
		})
	) {
		const error = new Error("Email address alredy exist");
		error.statusCode = 302;
		throw error;
	}
	const newEmployee = await employeeSchema.newEmployee(addedBy._id, employeeData);
	if (!newEmployee) {
		const error = new Error("Couldn't create employee");
		error.statusCode = 400;
		throw error;
	}

	return newEmployee;
};

exports.getAllEmployees = async (addedBy, queryParams) => {
	let filter = { addedBy: addedBy._id };
	const formattedFilter = JSON.parse(decodeURIComponent(queryParams.filter));

	const { page: currentPage = 1, limit: pageSize = 10 } = formattedFilter;
	
	const sortOrder = {};
	Object.keys(formattedFilter.sort).forEach((key) => {
		if (formattedFilter.sort[key]) sortOrder[key] = formattedFilter.sort[key] === "asc" ? 1 : -1;
	});

	
	if(formattedFilter.search.departments.length){
		filter.department = {$in: formattedFilter.search.departments}
	}

	if(formattedFilter.search.position.length){
		filter.position = { $in: formattedFilter.search.position };
	}

	if(formattedFilter.search.nameOrEmail){
		filter.$or = [
			{ name: new RegExp(formattedFilter.search.nameOrEmail, "i") },
			{ email: new RegExp(formattedFilter.search.nameOrEmail, "i") },
		];
	}
	
	const projection = "-addedBy -createdAt -updatedAt";

	const skip = (currentPage - 1) * pageSize;
	return await employeeSchema.getAllEmployees(
		filter, 
		{
			currentPage: currentPage,
			pageSize: pageSize,
			skip: skip,
		},
		sortOrder,
        projection,
	);
};

exports.employeeById = async (addedBy, employeeId) => {
	const employee = await employeeSchema.employeeById(addedBy._id, employeeId);
	if (!employee) {
		const error = new Error("Employee not found");
		error.status = 404;
		throw error;
	}
	return employee;
};

exports.deleteEmployeeById = async (addedBy, employeeId) => {
	const deletedEmployee = await employeeSchema.deleteEmployeeById( addedBy._id,employeeId);
	if (!deletedEmployee) {
		const error = new Error("Employee not found");
		error.status = 404;
		throw error;
	}
	return deletedEmployee;
};

exports.updateEmployee = async (addedBy, employeeId, employeeData) => {
	const updatedEmployee = await employeeSchema.updateEmployee(
		addedBy._id,
		employeeId,
		employeeData
	);
	if (!updatedEmployee) {
		const error = new Error("Employee not found");
		error.status = 404;
		throw error;
	}
	return updatedEmployee;
};