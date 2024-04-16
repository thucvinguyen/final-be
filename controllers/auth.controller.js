const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { AppError, catchAsync, sendResponse } = require("../helpers/utils");

const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  // get data from request
  let { email, password } = req.body;
  // validation
  let user = await User.findOne({ email }, "+password");
  if (!user) throw new AppError(400, "Invalid Credentials", "Login Error");
  // process
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError(400, "Wrong Password", "Login Error");
  const accessToken = await user.generateToken();
  // response
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
