const { getAllMenuItems, getMenuItemById } = require("../services/menuService");

// Fetch all menu items
async function fetchMenuItems(req, res) {
  try {
    const items = await getAllMenuItems();
    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Fetch single menu item by ID
async function fetchMenuItem(req, res) {
  try {
    const { id } = req.params;
    const item = await getMenuItemById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { fetchMenuItems, fetchMenuItem };
