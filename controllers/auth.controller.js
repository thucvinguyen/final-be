const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { AppError, catchAsync, sendResponse } = require("../helpers/utils");
const admin = require("../config/firebaseConfig");

const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;

  let user = await User.findOne({ email }, "+password");
  if (!user) throw new AppError(400, "Invalid Credentials", "Login Error");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(400, "Wrong Password", "Login Error");
  const accessToken = await user.generateToken();

  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login Successfully"
  );
});

authController.loginWithGoogle = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  // Verify the token with Firebase Admin SDK
  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(token);
  } catch (error) {
    throw new AppError(401, "Invalid Google token", "Login Error");
  }

  const { email, name } = decodedToken;

  // Find or create the user in the database
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, name });
  }

  // Generate an access token for the user
  const accessToken = await user.generateToken();

  // Send response
  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login Successfully"
  );
});

module.exports = authController;
