const express = require("express");
const authRouter = require("./auth"); 

const apiRouter = express.Router();

const routesConfig = [
  {
    path: "/auth",
    router: authRouter,
  },
];

routesConfig.forEach(({ path, router: subRouter, middlewares }) => {
  if (subRouter) {
    if (middlewares && middlewares.length > 0) {
      apiRouter.use(path, ...middlewares, subRouter);
    } else {
      apiRouter.use(path, subRouter);
    }
  }
});

// FIXED: Optional 404 handler (as a function, no path wildcard to avoid path-to-regexp error)
apiRouter.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

module.exports = apiRouter;
