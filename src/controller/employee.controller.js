const { EmployeeService: empServ } = require("../service/index");

exports.newEmployee = async (request, response) => {
    const newEmployee = await empServ.newEmployee(request.user, request.body);
	response.status(200).json({
		success: true,
        newEmployee
	});
};

exports.getAllemployees = async(request, response) => {

    const employees = await empServ.getAllEmployees(
		request.user,
		request.query
	);
	
    response.status(200).json({success: true, ...employees})
}

exports.exmployeeById = async(request, response) => {
    const employee = await empServ.employeeById(
		request.user,
		request.params.id
	);
    response.status(200).json({success: true, employee});
}

exports.deleteEmployeeById = async(request, response) => {
    const deletedEmployee = await empServ.deleteEmployeeById(
		request.user,
		request.params.id
	);
    response.status(200).json({success: true, deletedEmployee});
}

exports.updateEmployee = async(request, response) => {
    const updatedEmployee = await empServ.updateEmployee(
		request.user,
		request.params.id,
		request.body
	);
    response.status(200).json({success: true, updatedEmployee});
}