const express = require("express");
const authRouter = require("./auth");

const apiRouter = express.Router();

const router = [
  {
    path: "/auth",
    router: authRouter,
  },
];

router.forEach(({ path, router, middlewares }) => {
  if (router) {
    if (middlewares && middlewares.length > 0) {
      apiRouter.use(path, ...middlewares, router);
    } else {
      apiRouter.use(path, router);
    }
  }
});

module.exports = apiRouter;
