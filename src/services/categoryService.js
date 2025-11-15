const Category = require("../models/Category");

class CategoryService {
  static async createCategory({ name, description, createdBy }) {
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) throw new Error("Category already exists");
    const cat = new Category({ name: name.trim(), description, createdBy });
    await cat.save();
    return cat;
  }

  static async getAllCategories() {
    return Category.find().sort({ name: 1 });
  }

  static async getById(id) {
    return Category.findById(id);
  }
}

module.exports = CategoryService;
