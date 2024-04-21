const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workoutSchema = new Schema(
  {
    name: { type: String, required: true },
    part: { type: String, required: true },
    equipment: { type: String, required: true },
    level: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, select: false },
  },

  {
    timestamps: true,
  }
);

const Workout = mongoose.model("Workout", workoutSchema);
module.exports = Workout;
