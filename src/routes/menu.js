const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createMenuItem,
  getMyMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Create
router.post("/", protect, upload.array("images", 5), createMenuItem);

// Get current user's menu items
router.get("/me", protect, getMyMenuItems);

// Get single (public)
router.get("/:id", getMenuItem);

// Update
router.put("/:id", protect, upload.array("images", 5), updateMenuItem);

// Delete
router.delete("/:id", protect, deleteMenuItem);

module.exports = router;
