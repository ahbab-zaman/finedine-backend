const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
    required: true,
  },
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now },
});

const CartItem = mongoose.model("CartItem", cartItemSchema);

module.exports = CartItem;
