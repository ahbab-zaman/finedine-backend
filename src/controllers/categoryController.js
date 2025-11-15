const CategoryService = require("../services/categoryService");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || name.trim().length < 2) {
      return res
        .status(400)
        .json({ success: false, message: "Category name required" });
    }
    const cat = await CategoryService.createCategory({
      name,
      description,
      createdBy: req.user && req.user._id,
    });
    res.status(201).json({ success: true, category: cat });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const cats = await CategoryService.getAllCategories();
    res.json({ success: true, categories: cats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
