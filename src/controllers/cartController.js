const cartService = require("../services/cartService");

// Add item to cart
exports.addCartItem = async (req, res) => {
  try {
    const { userId, menuItemId, quantity } = req.body;
    const cartItem = await cartService.addToCart(userId, menuItemId, quantity);
    res.status(200).json({ success: true, cartItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all cart items for a user
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cartItems = await cartService.getUserCart(userId);
    res.status(200).json({ success: true, cartItems });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update quantity
exports.updateCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const cartItem = await cartService.updateCartItem(cartItemId, quantity);
    res.status(200).json({ success: true, cartItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Remove item from cart
exports.removeCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    await cartService.removeCartItem(cartItemId);
    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
