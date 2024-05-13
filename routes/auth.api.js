const express = require("express");
const authController = require("../controllers/auth.controller");
const { body } = require("express-validator");
const validators = require("../middlewares/validators");
const router = express.Router();
const passport = require("passport");
require("../middlewares/passport");

// @route POST/auth/login
// @description Log in with email and password
// @body email, password
// @access public
router.post(
  "/login",
  validators.validate([
    body("email", "Invalid Email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid Password").exists().notEmpty(),
  ]),
  authController.loginWithEmail
);

module.exports = router;
