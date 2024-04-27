const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    rating: {
      type: Number,
      required: false,
      min: 1,
      max: 5,
    },
    message: {
      type: String,
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
