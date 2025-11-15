const MenuService = require("../services/menuService");
const path = require("path"); // Add for basename
const fs = require("fs");
const chalk = require("chalk");
// Create menu item (multipart form-data with images[] or images)
exports.createMenuItem = async (req, res) => {
  try {
    const {
      category,
      item_name,
      short_description,
      price,
      price_per_calorie,
      calories,
      ingredients,
    } = req.body;
    if (!category || !item_name || !price || !calories) {
      return res.status(400).json({
        success: false,
        message: "category, item_name, price, calories are required",
      });
    }
    // images handled by multer -> req.files
    // Store ONLY filenames (e.g., "timestamp-filename.jpg")
    const images = (req.files || []).map((f) => path.basename(f.path));
    console.log(chalk.green(`Uploaded images: ${images.join(", ")}`)); // Debug log (add chalk if not imported)

    const ingArray = ingredients
      ? typeof ingredients === "string"
        ? ingredients
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : ingredients
      : [];

    const item = await MenuService.createMenuItem({
      owner: req.user._id,
      category,
      item_name,
      short_description,
      price: parseFloat(price),
      price_per_calorie: price_per_calorie
        ? parseFloat(price_per_calorie)
        : undefined,
      calories: parseFloat(calories),
      ingredients: ingArray,
      images,
    });

    res.status(201).json({ success: true, menuItem: item });
  } catch (err) {
    // Cleanup partial uploads on error
    if (req.files) {
      req.files.forEach((f) => fs.unlinkSync(f.path));
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getMyMenuItems = async (req, res) => {
  try {
    const items = await MenuService.getMenuItemsByUser(req.user._id);
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMenuItem = async (req, res) => {
  try {
    const item = await MenuService.getMenuItemById(req.params.id);
    if (!item)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.files && req.files.length) {
      // Replace existing images with new filenames only
      update.images = (req.files || []).map((f) => path.basename(f.path));
      console.log(chalk.green(`Updated images: ${update.images.join(", ")}`)); // Debug
    }
    if (update.ingredients && typeof update.ingredients === "string") {
      update.ingredients = update.ingredients
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    const item = await MenuService.updateMenuItem(
      req.params.id,
      req.user._id,
      update
    );
    res.json({ success: true, item });
  } catch (err) {
    // Cleanup on error
    if (req.files) {
      req.files.forEach((f) => fs.unlinkSync(f.path));
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuService.deleteMenuItem(req.params.id, req.user._id);
    // Optional: Delete physical images on delete
    if (item && item.images) {
      item.images.forEach((filename) => {
        const filePath = path.join(process.cwd(), "uploads", filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }
    res.json({ success: true, message: "Deleted", item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.getAllMenus = async (req, res) => {
  try {
    const items = await MenuService.getAllMenuItems();
    res.json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
