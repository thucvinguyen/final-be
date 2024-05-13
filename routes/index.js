var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send({ status: "Welcome", data: "Hello" });
});

const authApi = require("./auth.api");
router.use("/auth", authApi);

const userApi = require("./user.api");
router.use("/users", userApi);

const workoutApi = require("./workout.api");
router.use("/workouts", workoutApi);

const exerciseApi = require("./exercise.api");
router.use("/exercises", exerciseApi);

const mealApi = require("./meal.api");
router.use("/meals", mealApi);

const feedbackApi = require("./feedback.api");
router.use("/feedbacks", feedbackApi);

module.exports = router;
