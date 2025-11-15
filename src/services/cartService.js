const Cart = require("../models/Cart");
const MenuItem = require("../models/MenuItem");

class CartService {
  static async getCartByUser(userId) {
    let cart = await Cart.findOne({ user: userId }).populate({
      path: "items.menuItem",
      populate: { path: "category owner", select: "name" },
    });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
    }
    return cart;
  }

  static async addItem(userId, menuItemId, quantity = 1) {
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) throw new Error("Menu item not found");

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existing = cart.items.find(
      (it) => it.menuItem.toString() === menuItemId
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ menuItem: menuItemId, quantity });
    }
    await cart.save();
    return this.getCartByUser(userId);
  }

  static async removeItem(userId, cartItemId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");
    cart.items = cart.items.filter((it) => it._id.toString() !== cartItemId);
    await cart.save();
    return this.getCartByUser(userId);
  }

  static async updateQuantity(userId, cartItemId, quantity) {
    if (quantity < 1) throw new Error("Quantity must be at least 1");
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");
    const item = cart.items.id(cartItemId);
    if (!item) throw new Error("Cart item not found");
    item.quantity = quantity;
    await cart.save();
    return this.getCartByUser(userId);
  }

  static async clearCart(userId) {
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    return this.getCartByUser(userId);
  }
}

module.exports = CartService;
