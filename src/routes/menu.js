const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // For dir safety
const {
  createMenuItem,
  getMyMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllMenus,
} = require("../controllers/menuController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

// Ensure uploads dir exists (redundant but safe)
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup: Upload to project root /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${unique}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"));
    }
  },
});

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

router.get("/", getAllMenus); // public route to get all menu items

module.exports = router;
