const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

// Add item
router.post("/", cartController.addCartItem);

// Get user cart
router.get("/:userId", cartController.getCart);

// Update quantity
router.patch("/:cartItemId", cartController.updateCart);

// Remove item
router.delete("/:cartItemId", cartController.removeCart);

module.exports = router;
