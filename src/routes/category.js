const express = require("express");
const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");
// const { protect } = require("../middlewares/auth"); 

const router = express.Router();

router.get("/", getCategories);
router.post("/", createCategory);

module.exports = router;
