const {connect, connection} = require('mongoose');
require('dotenv').config();

exports.connectDB = async()=>{
    try {
        await connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
} 

exports.disconnectDB = async()=>{
    await connection.close();
    console.log('MongoDB connection closed');
}