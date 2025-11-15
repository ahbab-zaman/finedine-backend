const Category = require("../models/Category");

const DEFAULT_CATEGORIES = ["Starters", "Salad", "Desserts", "Main Courses"];

async function ensureDefaultCategories() {
  for (const name of DEFAULT_CATEGORIES) {
    const exists = await Category.findOne({ name });
    if (!exists) {
      await new Category({
        name,
        description: `${name} default category`,
      }).save();
    }
  }
  console.log("Default categories ensured");
}

module.exports = ensureDefaultCategories;
