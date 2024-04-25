const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workout.controller");
const { body, param, query } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

// @route GET/workouts?page=1&limit=10
// @description Get workouts with pagination
// @access log in required
// router.get("/", authentication.loginRequired, workoutController.getWorkouts);

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

// @route GET /workouts
// @description Get workouts by query parameters (name, part, equipment, etc.)
// @access Log in required
router.get(
  "/",
  authentication.loginRequired,
  validators.validate([
    query("name", "Invalid Name").optional().notEmpty(),
    query("part", "Invalid Part").optional().notEmpty(),
    query("equipment", "Invalid Equipment").optional().notEmpty(),
    query("level", "Invalid Level").optional().notEmpty(),
  ]),
  workoutController.getWorkouts
);

module.exports = router;
