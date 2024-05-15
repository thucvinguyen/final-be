const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, select: false },
    gender: {
      type: String,
      required: false,
      enum: ["Male", "Female"],
    },
    age: { type: Number, required: false },
    goal: {
      type: String,
      enum: ["Lose fat", "Gain muscle", "Maintain health"],
      required: false,
    },
    meal: [{ type: Schema.Types.ObjectId, ref: "Meal", required: false }],
    exercise: [
      { type: Schema.Types.ObjectId, ref: "Exercise", required: false },
    ],
    weight: { type: Number, required: false },
    height: { type: Number, required: false },
    avatarUrl: { type: String, required: false, default: "" },
    isDeleted: { type: Boolean, default: false, select: false },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.password;
  delete user.isDeleted;
  return user;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
