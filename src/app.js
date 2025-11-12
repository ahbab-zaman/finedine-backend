import express from "express";
import cors from "cors";
import morgan from "morgan";
import chalk from "chalk";
import dayjs from "dayjs";

const app = express();

app.use(express.json());
app.use(cors());

// --- Custom morgan logger with colors ---
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
      chalk.blue(tokens.method(req, res)),
      chalk.white(tokens.url(req, res)),
      tokens.statusColor(req, res),
      chalk.magenta(`${tokens["response-time"](req, res)} ms`),
    ].join(" ");
  })
);

// --- Routes ---

// --- Error handler ---
// app.use(errorHandler);

export default app;
