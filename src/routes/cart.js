const express = require("express");
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/", addToCart); // body: { menuItemId, quantity }
router.delete("/:cartItemId", removeFromCart);
router.put("/:cartItemId", updateCartQuantity); // { quantity }
router.post("/clear", clearCart);

module.exports = router;
