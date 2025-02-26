const {app, connectDB, disconnectDB} = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 4000;
(async()=>{
    await connectDB();
    app.listen(PORT || 3000, () =>
		console.log(`Server is running on port ${PORT}`)
	);
})();