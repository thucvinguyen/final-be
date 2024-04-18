const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const exerciseSchema = new Schema(
  {
    name: { type: String, required: true },
    part: { type: String, required: true },
    equipment: { type: String, required: true },
    level: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    // user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // sets: { type: Number, required: true },
    // reps: { type: Number, required: true },
    // weight: { type: Number, required: true },
    // isDeleted: { type: Boolean, default: false, select: false },
  },

  {
    timestamps: true,
  }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = Exercise;
