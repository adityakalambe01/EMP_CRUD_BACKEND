const employeeConstant = {
	positionEnum: {
		default: "Trainee Software Engineer",
		options: [
			"Trainee Software Engineer",
			"Senior Software Developer",
			"Full Stack Developer",
			"Game Developer",
			"QA Engineer",
			"Test Automation Engineer",
			"Chief Technology Officer (CTO)",
			"Director of Technology",
			"IT Support Specialist",
			"IT Manager",
			"Chief Information Officer (CIO)"
		]
	},
	genderEnum: {
		default: "Male",
		options: ["Male", "Female", "Other"],
	},
	departmentEnum: {
		default: "Engineering",
		options: [
			"Engineering",
			"Human Resources",
			"Finance",
			"Marketing",
			"Operations",
			"IT Support",
			"Customer Service",
			"Research and Development",
			"Quality Assurance",
			"Security",
			"Compliance",
		],
	},
};

module.exports = employeeConstant;