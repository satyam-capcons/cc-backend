const mongoose = require('mongoose');

const connectToMongoDB = async (url) => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // rethrow the error to handle it outside
    }
};

module.exports = connectToMongoDB;
