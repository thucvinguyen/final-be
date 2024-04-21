const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    gender: {
      type: String,
      required: false,
      enum: ["Male", "Female", "Other"],
    },
    age: { type: Number, required: false },
    // role: {
    //   type: String,
    //   enum: ["gymer", "trainer"],
    //   required: false,
    //   default: "",
    // },
    goal: {
      type: String,
      enum: ["Lose fat", "Gain muscle", "Mantain health"],
      required: false,
      default: "",
    },
    weight: { type: Number, required: false, default: 0 },
    height: { type: Number, required: false, default: 0 },
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
