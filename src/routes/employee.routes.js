const router = require("express").Router();

const {dataValidator} = require("../middleware/data.validator")
const {EmployeeSchema} = require("../validations/index");
const {
	newEmployee,
	getAllemployees,
	exmployeeById,
	deleteEmployeeById,
	updateEmployee,
} = require("../controller/index").EmployeeController;

const {tryCatchMiddleware} = require("../middleware/tryCatch.middleware");
router
	.post("/", dataValidator(EmployeeSchema.newEmployee),  tryCatchMiddleware(newEmployee))
	.get("/", tryCatchMiddleware(getAllemployees))
	.get("/:id", tryCatchMiddleware(exmployeeById))
	.delete("/:id", tryCatchMiddleware(deleteEmployeeById))
	.put("/:id", dataValidator(EmployeeSchema.updateEmployee), tryCatchMiddleware(updateEmployee));

module.exports = router;

