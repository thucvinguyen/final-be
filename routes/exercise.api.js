const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exercise.controller");
const { body, param } = require("express-validator");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

// @route GET/exercises?page=1&limit=10
// @description Get exercises with pagination
// @access log in required
router.get("/", authentication.loginRequired, exerciseController.getExercises);

module.exports = router;
