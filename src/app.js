const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const chalk = require("chalk");
const dayjs = require("dayjs");
const path = require("path");
const app = express();
const apiRouter = require("./routes/index");

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


morgan.token("time", () => dayjs().format("YYYY-MM-DD HH:mm:ss"));
morgan.token("statusColor", (req, res) => {
  const status = res.statusCode;
  if (status >= 500) return chalk.red(status);
  if (status >= 400) return chalk.yellow(status);
  if (status >= 300) return chalk.cyan(status);
  if (status >= 200) return chalk.green(status);
  return status;
});

app.use(
  morgan((tokens, req, res) => {
    return [
      chalk.gray(`[${tokens.time(req, res)}]`),
      chalk.cyan(tokens.method(req, res)),
      chalk.white(tokens.url(req, res)),
      tokens.statusColor(req, res),
      chalk.magenta(`${tokens["response-time"](req, res)} ms`),
    ].join(" ");
  })
);

// --- Routes ---
app.use("/api", apiRouter);
// --- Error handler ---
// app.use(errorHandler);

module.exports = app;
