import app from "./app.js";
import chalk from "chalk";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(chalk.greenBright("🚀 Server running successfully!"));
  console.log(chalk.magenta(`🌐 URL: http://localhost:${PORT}`));
  console.log(chalk.gray("-------------------------------------------"));
});
