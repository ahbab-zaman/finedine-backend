const mongoose = require("mongoose");
const chalk = require("chalk");

const connectDB = async () => {
 console.log(chalk.cyan("⏳ Connecting to MongoDB..."));

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(chalk.green("✅ MongoDB connected successfully!"));
    console.log(chalk.yellow(`📦 Database Name: ${mongoose.connection.name}`));
    console.log(chalk.cyan(`🧩 Host: ${mongoose.connection.host}`));
  } catch (error) {
    console.error(chalk.red("❌ MongoDB connection failed: " + error.message));
    process.exit(1);
  }
};

module.exports = connectDB;
