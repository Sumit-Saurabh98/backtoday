const mongoose = require('mongoose');
require("dotenv").config()

const connection = async()=>{
    await mongoose.connect(process.env.MONGODB_URL);
}

module.exports = connection