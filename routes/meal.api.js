const express = require("express");
const mealController = require("../controllers/meal.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const router = express.Router();
const authentication = require("../middlewares/authentication");

// @route POST/meals
// @description Log new meal
// @body name, calories
// @login required
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("name", "Invalid Name").exists().notEmpty(),
    body("calories", "Invalid Calories").exists().notEmpty().isInt({ min: 0 }),
  ]),
  mealController.createMeal
);

// @route GET/meals/:userId?page=1&limit=10
// @description Get meals user can see with pagination
// @access log in required
router.get(
  "/:userId",
  authentication.loginRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  mealController.getMeals
);

// @route PUT/meals/:id
// @description Update a meal
// @body name, sets, reps
// @access log in required
router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  mealController.updateSingleMeal
);

// @route DELETE/meals/:id
// @description Delete a meal
// @access log in required
router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  mealController.deleteSingleMeal
);

module.exports = router;
