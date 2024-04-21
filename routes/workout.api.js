const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workout.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

// @route GET/workouts?page=1&limit=10
// @description Get workouts with pagination
// @access log in required
router.get("/", authentication.loginRequired, workoutController.getWorkouts);

// @route GET/workouts/:name
// @description Get workouts by name
// @access log in required
router.get(
  "/:name",
  authentication.loginRequired,
  validators.validate([
    param("name", "Username cannot empty").notEmpty(),
    param("name", "Username must be Alphabet").matches(/^[A-Za-z\s]+$/),
  ]),
  workoutController.getWorkoutsByName
);

module.exports = router;
