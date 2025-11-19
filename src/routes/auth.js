const express = require("express");
const {
  register,
  login,
  getCurrentUser,
  updateProfile,
  deleteAccount,
} = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getCurrentUser);
router.put("/me", protect, updateProfile);
router.delete("/me", protect, deleteAccount);

module.exports = router;
