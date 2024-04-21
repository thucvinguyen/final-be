const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mealSchema = new Schema(
  {
    name: { type: String, required: true },
    calories: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  {
    timestamps: true,
  }
);

const Meal = mongoose.model("Meal", mealSchema);
module.exports = Meal;
