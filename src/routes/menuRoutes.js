const express = require("express");
const {
  fetchMenuItems,
  fetchMenuItem,
} = require("../controllers/menuController");

const router = express.Router();

// Get all menu items
router.get("/", fetchMenuItems);

// Get a single menu item by ID
router.get("/:id", fetchMenuItem);

module.exports = router;
