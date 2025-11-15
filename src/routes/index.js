const express = require("express");
const apiRouter = express.Router();
const authRouter = require("./auth");
const menuRouter = require("./menu");
const cartRouter = require("./cart");
const categoryRouter = require("./category");
const routesConfig = [
  {
    path: "/auth",
    router: authRouter,
  },
  {
    path: "/menus",
    router: menuRouter,
  },
  {
    path: "/cart",
    router: cartRouter,
  },
  {
    path: "/category",
    router: categoryRouter,
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
