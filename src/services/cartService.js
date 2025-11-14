const CartItem = require("../models/cart");

exports.addToCart = async (userId, menuItemId, quantity = 1) => {
  let cartItem = await CartItem.findOne({ userId, menuItemId });
  if (cartItem) {
    cartItem.quantity += quantity;
    return cartItem.save();
  } else {
    cartItem = new CartItem({ userId, menuItemId, quantity });
    return cartItem.save();
  }
};

exports.getUserCart = async (userId) => {
  return CartItem.find({ userId }).populate("menuItemId");
};

exports.updateCartItem = async (cartItemId, quantity) => {
  return CartItem.findByIdAndUpdate(cartItemId, { quantity }, { new: true });
};

exports.removeCartItem = async (cartItemId) => {
  return CartItem.findByIdAndDelete(cartItemId);
};
