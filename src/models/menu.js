const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    isAvailable: Boolean,
  },
  { collection: "menu-item" }
);

module.exports = mongoose.model("Menu", menuSchema);
