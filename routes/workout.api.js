const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workout.controller");
const { body, param, query } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

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
