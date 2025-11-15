const CartService = require("../services/cartService");

exports.getCart = async (req, res) => {
  try {
    const cart = await CartService.getCartByUser(req.user._id);
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;
    if (!menuItemId)
      return res
        .status(400)
        .json({ success: false, message: "menuItemId required" });
    const cart = await CartService.addItem(
      req.user._id,
      menuItemId,
      parseInt(quantity || 1, 10)
    );
    res.status(201).json({ success: true, cart });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const cart = await CartService.removeItem(req.user._id, cartItemId);
    res.json({ success: true, cart });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateCartQuantity = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const cart = await CartService.updateQuantity(
      req.user._id,
      cartItemId,
      parseInt(quantity, 10)
    );
    res.json({ success: true, cart });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const cart = await CartService.clearCart(req.user._id);
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
