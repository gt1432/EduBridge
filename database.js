const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('MONGO_URI is undefined! Please set it in your environment variables.');
            return;
        }
        await mongoose.connect(uri);
        console.log('Connected to MongoDB successfully!');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
};

connectDB();
