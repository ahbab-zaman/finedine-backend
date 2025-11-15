const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    item_name: { type: String, required: true, trim: true },
    short_description: { type: String, default: "" },
    price: { type: Number, required: true }, // total price
    price_per_calorie: { type: Number }, // optional
    calories: { type: Number, required: true },
    ingredients: [{ type: String }],
    images: [{ type: String }], // file paths relative to /uploads
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
