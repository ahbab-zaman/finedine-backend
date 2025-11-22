require("dotenv").config(); // Load .env vars FIRST (e.g., MONGO_URI, PORT)

const connectDB = require("./config/db.js"); // Adjust path if db.js is elsewhere (e.g., './db')
const app = require("./app.js");
const chalk = require("chalk");

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(chalk.greenBright("🚀 Server running successfully!"));
      console.log(chalk.magenta(`🌐 URL: https://localhost:${PORT}`));
      console.log(chalk.gray("-------------------------------------------"));
    });
  })
  .catch((error) => {
    console.error(chalk.red("Failed to start server:", error.message));
    process.exit(1);
  });
