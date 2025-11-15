const MenuItem = require("../models/MenuItem");
const Category = require("../models/Category");

class MenuService {
  static async createMenuItem(data) {
    // Expect data: { owner, category, item_name, short_description, price, price_per_calorie, calories, ingredients, images }
    const category = await Category.findById(data.category);
    if (!category) throw new Error("Category not found");
    const item = new MenuItem(data);
    await item.save();
    return item;
  }

  static async getMenuItemsByUser(userId) {
    return MenuItem.find({ owner: userId })
      .populate("category")
      .sort({ createdAt: -1 });
  }

  static async getAllMenuItems() {
    return MenuItem.find()
      .populate("category owner", "name email")
      .sort({ createdAt: -1 });
  }

  static async getMenuItemById(id) {
    return MenuItem.findById(id).populate("category owner", "name email");
  }

  static async updateMenuItem(id, userId, updateData) {
    const item = await MenuItem.findOne({ _id: id, owner: userId });
    if (!item) throw new Error("Menu item not found or permission denied");
    Object.assign(item, updateData);
    await item.save();
    return item;
  }

  static async deleteMenuItem(id, userId) {
    const item = await MenuItem.findOneAndDelete({ _id: id, owner: userId });
    if (!item) throw new Error("Menu item not found or permission denied");
    return item;
  }
}

module.exports = MenuService;
