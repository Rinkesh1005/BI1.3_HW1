const mongoose = require("mongoose");
require("dotenv").config();
const mongoUri = process.env.MONGODB;

const initializeDatabase = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Database connected successfully.");
    })
    .catch((error) => console.log("Error in database connection.", error));
};

module.exports = { initializeDatabase };
