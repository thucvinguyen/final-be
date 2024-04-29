const express = require("express");
const exerciseController = require("../controllers/exercise.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const router = express.Router();
const authentication = require("../middlewares/authentication");

// @route POST/exercises
// @description Log new exercise
// @body name, caloriesBurned, sets, reps, date, userId
// @login required
router.post(
  "/",
  authentication.loginRequired,
  validators.validate([
    body("name", "Invalid Name").exists().notEmpty(),
    body("sets", "Invalid Set").exists().notEmpty().isInt({ min: 0 }),
    body("reps", "Invalid Rep").exists().notEmpty().isInt({ min: 0 }),
    // body("date", "Invalid Date").exists().notEmpty().isInt({ min: 0 }),
    // body("date", "Invalid Date")
    //   .exists()
    //   .notEmpty()
    //   .matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{2}$/),
  ]),

  exerciseController.createExercise
);

// @route GET/exercises/:userId?page=1&limit=10
// @description Get exercises user can see with pagination
// @access log in required
router.get(
  "/:userId",
  authentication.loginRequired,
  validators.validate([
    param("userId").exists().isString().custom(validators.checkObjectId),
  ]),
  exerciseController.getExercises
);

// @route PUT/exercises/:id
// @description Update an exercise
// @body name, sets, reps
// @access log in required
router.put(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  exerciseController.updateSingleExercise
);

// @route DELETE/exercises/:id
// @description Delete an exercise
// @access log in required
router.delete(
  "/:id",
  authentication.loginRequired,
  validators.validate([
    param("id").exists().isString().custom(validators.checkObjectId),
  ]),
  exerciseController.deleteSingleExercise
);

module.exports = router;
