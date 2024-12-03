const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoURL = process.env.MongoURL;
const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log("connected to DB!");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToMongo;