const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

// @route POST/users
// @description Registre new user
// @body name, email, password
// @access public
router.post(
  "/",
  validators.validate([
    body("name", "Invalid Name").exists().notEmpty(),
    body("email", "Invalid Email")
      .exists()
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body("password", "Invalid Password").exists().notEmpty(),
    body("height", "Height must be at least 100cm")
      .exists()
      .isFloat({ min: 100 }),
    body("weight", "Weight must be at least 10kg")
      .exists()
      .isFloat({ min: 10 }),
    body("goal", "Invalid Goal")
      .exists()
      .isIn(["Lose fat", "Gain muscle", "Maintain health"]),
    body("gender", "Invalid Gender").exists().isIn(["Male", "Female"]),
  ]),
  userController.register
);

// @route GET/users?page=1&limit=10
// @description Get users with pagination
// @access log in required
router.get("/", authentication.loginRequired, userController.getUsers);

// @route GET/users/me
// @description Get current user info
// @access log in required
router.get("/me", authentication.loginRequired, userController.getCurrentUser);

// @route GET/users/me/details
// @description Get current user info
// @access log in required
router.get(
  "/details",
  authentication.loginRequired,
  userController.getCurrentUserDetails
);

// @route GET/users/:id
// @description Get user profile
// @access log in required
router.get(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.getSingleUser
);

// @route PUT/users/:id
// @description Update user profile
// @body {name, avatarUrl, coverUrl... }
// @access log in required
router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  userController.updateProfile
);

module.exports = router;
