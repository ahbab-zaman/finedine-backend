const Menu = require("../models/menu");

async function getAllMenuItems() {
  return await Menu.find();
}

async function getMenuItemById(id) {
  return await Menu.findById(id);
}

module.exports = { getAllMenuItems, getMenuItemById };
